using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Models;

namespace WardDesk.Service
{
    public class ComplaintService
    {
        private readonly AppDbContext _context;

        public ComplaintService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ComplaintResponseDTO> CreateComplaintAsync(Guid citizenId, CreateComplaintDTO request)
        {
            // Validates category exists
            var category = await _context.ComplaintCategories
                .FirstOrDefaultAsync(c => c.CategoryId == request.CategoryId && c.IsActive);
            if (category == null)
                throw new InvalidOperationException("Invalid or inactive complaint category.");

            // Gets default "pending" status
            var pendingStatus = await _context.ComplaintStatuses
                .FirstOrDefaultAsync(s => s.StatusName == "pending");
            if (pendingStatus == null)
                throw new InvalidOperationException("Default complaint status not found.");
            // Get citizen's ward number
            var citizen = await _context.Users.FindAsync(citizenId);
            if (citizen == null)
                throw new InvalidOperationException("Citizen not found.");
            // Generates unique tracking ID (e.g., WD-20260226-A1B2C3)
            var trackingId = $"WD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

            var complaint = new Complaint
            {
                ComplaintId = Guid.NewGuid(),
                TrackingId = trackingId,
                CitizenId = citizenId,
                CategoryId = request.CategoryId,
                StatusId = pendingStatus.StatusId,
                Title = request.Title,
                Description = request.Description,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                WardNumber = citizen.WardNumber,
                LocationAddress = request.LocationAddress,
                PriorityLevel = string.IsNullOrWhiteSpace(request.PriorityLevel) ? "Medium Priority" : request.PriorityLevel,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Complaints.Add(complaint);

            // Adds photos if provided
            if (request.PhotoUrls != null && request.PhotoUrls.Count > 0)
            {
                foreach (var url in request.PhotoUrls)
                {
                    _context.ComplaintPhotos.Add(new ComplaintPhoto
                    {
                        PhotoId = Guid.NewGuid(),
                        ComplaintId = complaint.ComplaintId,
                        UploadedBy = citizenId,
                        PhotoUrl = url,
                        PhotoType = "complaint",
                        UploadedAt = DateTime.UtcNow,
                    });
                }
            }

            await _context.SaveChangesAsync();

            return MapToDTO(complaint, category.CategoryName, pendingStatus.StatusName, request.PhotoUrls);
        }
        public async Task<List<ComplaintResponseDTO>> GetComplaintsByCitizenAsync(Guid citizenId)
        {
            var complaints = await _context.Complaints
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Citizen)
                .Include(c => c.Photos)
                .Where(c => c.CitizenId == citizenId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return complaints.Select(c => MapToDTO(
                c,
                c.Category?.CategoryName ?? "",
                c.Status?.StatusName ?? "",
                c.Photos?.Select(p => p.PhotoUrl).ToList()
            )).ToList();
        }


        public async Task<ComplaintResponseDTO?> GetComplaintByTrackingIdAsync(string trackingId)
        {
            var c = await _context.Complaints
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Citizen)
                .Include(c => c.Photos)
                .FirstOrDefaultAsync(c => c.TrackingId == trackingId);

            if (c == null) return null;

            return MapToDTO(
                c,
                c.Category?.CategoryName ?? "",
                c.Status?.StatusName ?? "",
                c.Photos?.Select(p => p.PhotoUrl).ToList()
            );
        }

        public async Task<List<ComplaintResponseDTO>> GetAllComplaintsAsync()
        {
            var complaints = await _context.Complaints
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Citizen)
                .Include(c => c.Photos)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return complaints.Select(c => MapToDTO(
                c,
                c.Category?.CategoryName ?? "",
                c.Status?.StatusName ?? "",
                c.Photos?.Select(p => p.PhotoUrl).ToList()
            )).ToList();
        }
        private static ComplaintResponseDTO MapToDTO(
           Complaint c, string categoryName, string statusName, List<string>? photoUrls)
        {
            return new ComplaintResponseDTO
            {
                ComplaintId = c.ComplaintId,
                TrackingId = c.TrackingId,
                Title = c.Title,
                Description = c.Description,
                CategoryName = categoryName,
                CategoryId = c.CategoryId,
                StatusName = statusName,
                StatusId = c.StatusId,
                PriorityLevel = c.PriorityLevel,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                LocationAddress = c.LocationAddress,
                WardNumber = c.WardNumber,
                UpvoteCount = c.UpvoteCount,
                DownvoteCount = c.DownvoteCount,
                NetVotes = c.NetVotes,
                IsVerified = c.IsVerified,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ResolvedAt = c.ResolvedAt,
                PhotoUrls = photoUrls ?? new List<string>(),
                CitizenName = c.Citizen?.FullName ?? "",
                CitizenId = c.CitizenId,
            };
        }
    }
}
