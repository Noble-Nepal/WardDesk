using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Models;
using WardDesk.Service.Notifications;

namespace WardDesk.Service
{
    public class TechnicianWorkService
    {
        private readonly AppDbContext _context;
        private readonly IUserNotificationService _userNotificationService;

        public TechnicianWorkService(AppDbContext context, IUserNotificationService userNotificationService)
        {
            _context = context;
            _userNotificationService = userNotificationService;
        }

        public async Task<List<TechnicianAssignedComplaintDTO>> GetMyAssignedComplaintsAsync(Guid technicianId)
        {
            var assignments = await _context.Assignments
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Category)
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Status)
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Citizen)
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Photos)
                .Where(a => a.TechnicianId == technicianId)
                .OrderByDescending(a => a.AssignedAt)
                .ToListAsync();

            return assignments.Select(a => new TechnicianAssignedComplaintDTO
            {
                ComplaintId = a.ComplaintId,
                Title = a.Complaint!.Title,
                Category = a.Complaint.Category?.CategoryName,
                Status = a.Complaint.Status?.StatusName,
                Priority = a.Complaint.PriorityLevel,
                Address = a.Complaint.LocationAddress,
                WardNumber = a.Complaint.WardNumber,
                SubmittedDate = a.Complaint.CreatedAt,
                CitizenName = a.Complaint.Citizen?.FullName ?? "",
                Description = a.Complaint.Description,
                Latitude = a.Complaint.Latitude,
                Longitude = a.Complaint.Longitude,
                Remarks = a.Remarks,
                ComplaintPhoto = a.Complaint.Photos?
                    .Where(p => p.PhotoType == "complaint")
                    .OrderByDescending(p => p.UploadedAt)
                    .Select(p => p.PhotoUrl)
                    .FirstOrDefault(),
                WorkPhotos = a.Complaint.Photos?
                    .Where(p => p.PhotoType != "complaint")
                    .Select(p => p.PhotoUrl)
                    .ToList() ?? new List<string>()
            }).ToList();
        }

        public async Task UpdateWorkStatusAsync(Guid technicianId, Guid complaintId, UpdateWorkStatusDTO dto)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Status)
                .FirstOrDefaultAsync(a => a.ComplaintId == complaintId && a.TechnicianId == technicianId);

            if (assignment == null)
                throw new InvalidOperationException("Assignment not found.");

            var nextStatus = dto.Status.Trim().ToLower();
            if (nextStatus != "in_progress" && nextStatus != "completed" && nextStatus != "resolved")
                throw new InvalidOperationException("Invalid status.");

            var statusEntity = await _context.ComplaintStatuses
                .FirstOrDefaultAsync(s => s.StatusName.ToLower() == nextStatus);

            if (statusEntity == null)
                throw new InvalidOperationException("Target complaint status not found.");

            assignment.WorkStatus = nextStatus;
            assignment.UpdatedAt = DateTime.UtcNow;
            assignment.Remarks = string.IsNullOrWhiteSpace(dto.Remarks) ? assignment.Remarks : dto.Remarks;

            if (nextStatus == "in_progress" && assignment.StartedAt == null)
                assignment.StartedAt = DateTime.UtcNow;

            if (nextStatus == "completed")
                assignment.CompletedAt = DateTime.UtcNow;

            assignment.Complaint!.StatusId = statusEntity.StatusId;
            assignment.Complaint.UpdatedAt = DateTime.UtcNow;

            if (nextStatus == "resolved")
            {
                assignment.Complaint.ResolvedAt = DateTime.UtcNow;

                var citizen = await _context.Users.FirstOrDefaultAsync(u => u.UserId == assignment.Complaint.CitizenId);
                if (citizen != null && !string.IsNullOrWhiteSpace(citizen.Email))
                {
                    await _userNotificationService.SendComplaintResolvedEmailAsync(
                        citizen.Email,
                        citizen.FullName,
                        assignment.Complaint.ComplaintId,
                        assignment.Complaint.Title
                    );
                }
            }

            await RefreshTechnicianAvailabilityAsync(technicianId);
            await _context.SaveChangesAsync();
        }

        public async Task UploadWorkPhotoAsync(Guid technicianId, Guid complaintId, UploadWorkPhotoDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.PhotoUrl))
                throw new InvalidOperationException("Photo URL is required.");

            var photoType = dto.PhotoType.Trim().ToLower();
            if (photoType != "work_update" && photoType != "resolution")
                throw new InvalidOperationException("Photo type must be 'work_update' or 'resolution'.");

            var assignmentExists = await _context.Assignments
                .AnyAsync(a => a.ComplaintId == complaintId && a.TechnicianId == technicianId);

            if (!assignmentExists)
                throw new InvalidOperationException("Assignment not found.");

            _context.ComplaintPhotos.Add(new ComplaintPhoto
            {
                PhotoId = Guid.NewGuid(),
                ComplaintId = complaintId,
                UploadedBy = technicianId,
                PhotoUrl = dto.PhotoUrl,
                PhotoType = photoType,
                UploadedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        private async Task RefreshTechnicianAvailabilityAsync(Guid technicianId)
        {
            var busyStatuses = new[] { "assigned", "in_progress", "completed" };

            var hasActive = await _context.Assignments
                .Include(a => a.Complaint)!.ThenInclude(c => c!.Status)
                .AnyAsync(a =>
                    a.TechnicianId == technicianId &&
                    a.Complaint != null &&
                    a.Complaint.Status != null &&
                    busyStatuses.Contains(a.Complaint.Status.StatusName.ToLower()));

            var tech = await _context.Users.FirstOrDefaultAsync(u => u.UserId == technicianId);
            if (tech == null) return;

            tech.AssignmentStatus = hasActive ? "busy" : "unassigned";
            tech.UpdatedAt = DateTime.UtcNow;
        }
    }
}