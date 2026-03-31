using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WardDesk.Database;
using WardDesk.DTO;

namespace WardDesk.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;
        public AdminService(AppDbContext context) { _context = context; }

        // Fetch all pending technicians
        public async Task<List<UserDTO>> GetPendingTechniciansAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role != null && u.Role.RoleName.ToLower() == "technician" && !u.IsVerified)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    WardNumber = u.WardNumber,
                    Role = u.Role.RoleName,
                    IsActive = u.IsActive,
                    IsVerified = u.IsVerified,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> VerifyTechnicianAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || user.Role?.RoleName.ToLower() != "technician" || user.IsVerified) return false;
            user.IsVerified = true;
            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectTechnicianAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || user.Role?.RoleName.ToLower() != "technician" || user.IsVerified) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            return await _context.Users.Include(u => u.Role)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    WardNumber = u.WardNumber,
                    Role = u.Role != null ? u.Role.RoleName : null,
                    IsActive = u.IsActive,
                    IsVerified = u.IsVerified,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<UserDTO> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users.Include(u => u.Role)
                .Where(u => u.UserId == userId)
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    WardNumber = u.WardNumber,
                    Role = u.Role != null ? u.Role.RoleName : null,
                    IsActive = u.IsActive,
                    IsVerified = u.IsVerified,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<(bool ok, string oldRole, string newRole)> UpdateUserRoleAsync(Guid userId, int newRoleId)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || user.RoleId == newRoleId) return (false, null, null);
            var role = await _context.Roles.FindAsync(newRoleId);
            if (role == null) return (false, null, null);
            var oldRole = user.Role?.RoleName;
            user.RoleId = newRoleId;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, oldRole, role.RoleName);
        }

        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        
        public async Task<List<UserDTO>> GetCitizensAsync()
        {
            return await _context.Users.Include(u => u.Role)
                .Where(u => u.Role != null && u.Role.RoleName.ToLower() == "citizen")
                .Select(u => new UserDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    WardNumber = u.WardNumber,
                    Role = u.Role!.RoleName,
                    IsActive = u.IsActive,
                    IsVerified = u.IsVerified,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();
        }
    }
}