using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
using WardDesk.DTO;

namespace WardDesk.Service
{
    public class SuperadminService
    {
        private readonly AppDbContext _context;

        public SuperadminService(AppDbContext context)
        {
            _context = context;
        }

        // Only allows assigning roleId 1 (citizen) or 3 (admin).
        // Returns (success, errorMessage, updatedUser).
        public async Task<(bool ok, string? error, UserDTO? user)> AssignRoleAsync(Guid userId, int newRoleId)
        {
            if (newRoleId != 1 && newRoleId != 3)
                return (false, "Only citizen (1) or admin (3) roles can be assigned.", null);

            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return (false, "User not found.", null);

            if (user.Role?.RoleName.ToLower() == "technician" || user.Role?.RoleName.ToLower() == "superadmin")
                return (false, "Cannot change role for technicians or superadmins.", null);

            if (user.RoleId == newRoleId)
                return (false, "User already has this role.", null);

            user.RoleId = newRoleId;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Reload role name after save
            await _context.Entry(user).Reference(u => u.Role).LoadAsync();

            var dto = new UserDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                WardNumber = user.WardNumber,
                Role = user.Role!.RoleName,
                IsActive = user.IsActive,
                IsVerified = user.IsVerified,
                ProfilePhotoUrl = user.ProfilePhotoUrl,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
            };

            return (true, null, dto);
        }
    }
}
