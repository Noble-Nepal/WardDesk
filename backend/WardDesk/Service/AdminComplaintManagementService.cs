using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
using WardDesk.DTO;

namespace WardDesk.Service
{
    public class AdminComplaintManagementService
    {
        private readonly AppDbContext _context;

        public AdminComplaintManagementService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AdminComplaintListItemDTO>> GetComplaintsAsync(AdminComplaintFilterDTO filter)
        {
            var query = _context.Complaints
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Citizen)
                .Include(c => c.Photos)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var s = filter.Search.Trim().ToLower();
                query = query.Where(c =>
                    c.Title.ToLower().Contains(s) ||
                    c.TrackingId.ToLower().Contains(s) ||
                    (c.LocationAddress != null && c.LocationAddress.ToLower().Contains(s)));
            }

            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                var status = filter.Status.Trim().ToLower();
                query = query.Where(c => c.Status != null && c.Status.StatusName.ToLower() == status);
            }

            if (filter.CategoryId.HasValue)
                query = query.Where(c => c.CategoryId == filter.CategoryId.Value);

            if (filter.IsVerified.HasValue)
                query = query.Where(c => c.IsVerified == filter.IsVerified.Value);

            if (filter.WardNumber.HasValue)
                query = query.Where(c => c.WardNumber == filter.WardNumber.Value);

            return await query
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new AdminComplaintListItemDTO
                {
                    ComplaintId = c.ComplaintId,
                    TrackingId = c.TrackingId,
                    Title = c.Title,
                    Description = c.Description,
                    CategoryName = c.Category != null ? c.Category.CategoryName : "",
                    CategoryId = c.CategoryId,
                    StatusName = c.Status != null ? c.Status.StatusName : "",
                    StatusId = c.StatusId,
                    PriorityLevel = c.PriorityLevel,
                    IsVerified = c.IsVerified,
                    CitizenName = c.Citizen != null ? c.Citizen.FullName : "",
                    CitizenId = c.CitizenId,
                    WardNumber = c.WardNumber,
                    LocationAddress = c.LocationAddress,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    ResolvedAt = c.ResolvedAt,
                    PhotoUrls = c.Photos != null ? c.Photos.Select(p => p.PhotoUrl).ToList() : new List<string>()
                })
                .ToListAsync();
        }

        public async Task<AdminComplaintDetailDTO?> GetComplaintDetailAsync(Guid complaintId)
        {
            return await _context.Complaints
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Citizen)
                .Include(c => c.Photos)
                .Where(c => c.ComplaintId == complaintId)
                .Select(c => new AdminComplaintDetailDTO
                {
                    ComplaintId = c.ComplaintId,
                    TrackingId = c.TrackingId,
                    Title = c.Title,
                    Description = c.Description,
                    CategoryName = c.Category != null ? c.Category.CategoryName : "",
                    CategoryId = c.CategoryId,
                    StatusName = c.Status != null ? c.Status.StatusName : "",
                    StatusId = c.StatusId,
                    PriorityLevel = c.PriorityLevel,
                    IsVerified = c.IsVerified,
                    CitizenName = c.Citizen != null ? c.Citizen.FullName : "",
                    CitizenId = c.CitizenId,
                    WardNumber = c.WardNumber,
                    LocationAddress = c.LocationAddress,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    ResolvedAt = c.ResolvedAt,
                    Latitude = c.Latitude,
                    Longitude = c.Longitude,
                    UpvoteCount = c.UpvoteCount,
                    DownvoteCount = c.DownvoteCount,
                    NetVotes = c.NetVotes,
                    VerifiedBy = c.VerifiedBy,
                    VerifiedAt = c.VerifiedAt,
                    PhotoUrls = c.Photos != null ? c.Photos.Select(p => p.PhotoUrl).ToList() : new List<string>()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> SetVerificationAsync(Guid complaintId, Guid adminId, bool verify)
        {
            var complaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintId == complaintId);
            if (complaint == null) return false;

            complaint.IsVerified = verify;
            complaint.VerifiedBy = verify ? adminId : null;
            complaint.VerifiedAt = verify ? DateTime.UtcNow : null;
            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCategoryAsync(Guid complaintId, int categoryId)
        {
            var complaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintId == complaintId);
            if (complaint == null) return false;

            var categoryExists = await _context.ComplaintCategories
                .AnyAsync(c => c.CategoryId == categoryId && c.IsActive);
            if (!categoryExists)
                throw new InvalidOperationException("Invalid or inactive category.");

            complaint.CategoryId = categoryId;
            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStatusByNameAsync(Guid complaintId, string statusName)
        {
            if (string.IsNullOrWhiteSpace(statusName))
                throw new InvalidOperationException("Status name is required.");

            var complaint = await _context.Complaints.FirstOrDefaultAsync(c => c.ComplaintId == complaintId);
            if (complaint == null) return false;

            var normalized = statusName.Trim().ToLower();

            var status = await _context.ComplaintStatuses
                .FirstOrDefaultAsync(s => s.StatusName.ToLower() == normalized);
            if (status == null)
                throw new InvalidOperationException("Status not found.");

            complaint.StatusId = status.StatusId;
            complaint.UpdatedAt = DateTime.UtcNow;

            if (normalized == "resolved")
                complaint.ResolvedAt = DateTime.UtcNow;
            else
                complaint.ResolvedAt = null;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}