using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using WardDesk.Database;
using WardDesk.DTO;
using WardDesk.Service.Notifications;

namespace WardDesk.Service
{
    public class AccountAdministrationService
    {
        private readonly AppDbContext _context;
        private readonly IUserNotificationService _notificationService;

        public AccountAdministrationService(
            AppDbContext context,
            IUserNotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<AccountStatusChangeResultDTO> SetAccountActiveStatusAsync(
            Guid userId,
            bool isActive,
            string? reason)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new InvalidOperationException("User not found.");

            var old = user.IsActive;
            user.IsActive = isActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _notificationService.SendAccountStatusChangedEmailAsync(
                user.Email,
                user.FullName,
                isActive,
                reason
            );

            return new AccountStatusChangeResultDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                OldIsActive = old,
                NewIsActive = user.IsActive
            };
        }

        public async Task<bool> RejectTechnicianAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null || user.Role?.RoleName.ToLower() != "technician" || user.IsVerified)
                return false;

            // 1) Email notification first (optional ordering; you can move after delete if preferred)
            await _notificationService.SendRegistrationRejectedEmailAsync(
                user.Email,
                user.FullName,
                null
            );

            // 2) Remove from Firebase Auth if firebase uid exists
            if (!string.IsNullOrWhiteSpace(user.FirebaseUid))
            {
                try
                {
                    await FirebaseAuth.DefaultInstance.DeleteUserAsync(user.FirebaseUid);
                }
                catch (FirebaseAuthException ex) when (ex.AuthErrorCode == AuthErrorCode.UserNotFound)
                {
                    // already removed in firebase; continue
                }
            }

            // 3) Remove from local DB
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}