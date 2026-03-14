using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Models;

namespace WardDesk.Service
{
    public class AssignmentService
    {
        private readonly AppDbContext _context;

        public AssignmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AssignmentDTO> AssignComplaintAsync(Guid adminId, CreateAssignmentDTO request)
        {
            var complaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintId == request.ComplaintId);
            if (complaint == null)
                throw new InvalidOperationException("Complaint not found.");

            var existing = await _context.Assignments.FirstOrDefaultAsync(a => a.ComplaintId == request.ComplaintId);
            if (existing != null)
                throw new InvalidOperationException("This complaint is already assigned.");

            var tech = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == request.TechnicianId && u.Role != null && u.Role.RoleName.ToLower() == "technician");
            if (tech == null)
                throw new InvalidOperationException("Technician not found.");

            var assignment = new Assignment
            {
                AssignmentId = Guid.NewGuid(),
                ComplaintId = request.ComplaintId,
                TechnicianId = request.TechnicianId,
                AssignedBy = adminId,
                AssignedAt = DateTime.UtcNow,
                Remarks = request.Remarks
            };

            _context.Assignments.Add(assignment);

            var assignedStatus = await _context.ComplaintStatuses.FirstOrDefaultAsync(s => s.StatusName.ToLower() == "assigned");
            if (assignedStatus == null) throw new InvalidOperationException("Assigned status not found.");
            complaint.StatusId = assignedStatus.StatusId;
            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetAssignmentDTOByIdOrThrow(assignment.AssignmentId);
        }

        public async Task<AssignmentDTO> GetAssignmentDTOByIdOrThrow(Guid assignmentId)
        {
            var assignment = await _context.Assignments
                .Include(a => a.Technician)
                .Include(a => a.Assigner)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                throw new InvalidOperationException("Assignment not found.");

            return new AssignmentDTO
            {
                AssignmentId = assignment.AssignmentId,
                ComplaintId = assignment.ComplaintId,
                TechnicianId = assignment.TechnicianId,
                TechnicianName = assignment.Technician?.FullName ?? "",
                AssignedBy = assignment.AssignedBy,
                AssignedByName = assignment.Assigner?.FullName ?? "",
                AssignedAt = assignment.AssignedAt,
                Remarks = assignment.Remarks
            };
        }

        public async Task<List<AssignmentDTO>> GetAssignmentsForComplaint(Guid complaintId)
        {
            var list = await _context.Assignments
                .Include(a => a.Technician)
                .Include(a => a.Assigner)
                .Where(a => a.ComplaintId == complaintId)
                .ToListAsync();

            return list.Select(a => new AssignmentDTO
            {
                AssignmentId = a.AssignmentId,
                ComplaintId = a.ComplaintId,
                TechnicianId = a.TechnicianId,
                TechnicianName = a.Technician?.FullName ?? "",
                AssignedBy = a.AssignedBy,
                AssignedByName = a.Assigner?.FullName ?? "",
                AssignedAt = a.AssignedAt,
                Remarks = a.Remarks
            }).ToList();
        }
    }
}