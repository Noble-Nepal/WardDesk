using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Models;

namespace WardDesk.Service
{
    public class WardService
    {
        private readonly AppDbContext _context;

        public WardService(AppDbContext context)
        {
            _context = context;
        }

        // Public — used by Registration and ReportIssue forms
        public async Task<List<WardAreaDTO>> GetAllAreasAsync()
        {
            return await _context.WardAreas
                .Where(a => a.IsActive)
                .OrderBy(a => a.AddressName)
                .Select(a => new WardAreaDTO
                {
                    WardAreaId = a.WardAreaId,
                    AddressName = a.AddressName,
                    WardFrom = a.WardFrom,
                    WardTo = a.WardTo,
                })
                .ToListAsync();
        }

        // Superadmin — add a new address with ward range
        public async Task<(bool ok, string? error, WardAreaDTO? area)> AddAreaAsync(string addressName, int wardFrom, int wardTo)
        {
            var trimmed = addressName.Trim();
            if (string.IsNullOrEmpty(trimmed))
                return (false, "Address name is required.", null);

            if (wardFrom < 1 || wardTo < wardFrom)
                return (false, "Ward range is invalid. WardFrom must be ≥ 1 and WardTo must be ≥ WardFrom.", null);

            var exists = await _context.WardAreas
                .AnyAsync(a => a.AddressName.ToLower() == trimmed.ToLower());
            if (exists)
                return (false, $"Address '{trimmed}' already exists.", null);

            var area = new WardArea
            {
                AddressName = trimmed,
                WardFrom = wardFrom,
                WardTo = wardTo,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            };

            _context.WardAreas.Add(area);
            await _context.SaveChangesAsync();

            return (true, null, new WardAreaDTO
            {
                WardAreaId = area.WardAreaId,
                AddressName = area.AddressName,
                WardFrom = area.WardFrom,
                WardTo = area.WardTo,
            });
        }

        // Superadmin — delete an address
        public async Task<(bool ok, string? error)> DeleteAreaAsync(int wardAreaId)
        {
            var area = await _context.WardAreas.FindAsync(wardAreaId);
            if (area == null) return (false, "Address not found.");

            _context.WardAreas.Remove(area);
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}
