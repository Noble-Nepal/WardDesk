using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using WardDesk.Database;
using WardDesk.DTO;
using FirebaseAdmin.Auth;

namespace WardDesk.Services
{
    public class ProfileService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public ProfileService(AppDbContext context, IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<UserProfileDTO?> GetUserProfileAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return null;

            return new UserProfileDTO
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                WardNumber = user.WardNumber,
                Role = user.Role!.RoleName,
                ProfilePhotoUrl = user.ProfilePhotoUrl,
                IsActive = user.IsActive,
                IsVerified = user.IsVerified,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public async Task<bool> UpdateUserProfileAsync(Guid userId, UpdateProfileDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.WardNumber = dto.WardNumber;
            user.Address = dto.Address;
            user.ProfilePhotoUrl = dto.ProfilePhotoUrl;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordFirebaseAsync(Guid userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            var firebaseApiKey = _config["Firebase:WebApiKey"];
            if (string.IsNullOrEmpty(firebaseApiKey)) throw new InvalidOperationException("Firebase:WebApiKey not found");

            // 1. Verify current password using Firebase REST
            var httpClient = _httpClientFactory.CreateClient();
            var resp = await httpClient.PostAsJsonAsync(
                $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebaseApiKey}",
                new { email = user.Email, password = currentPassword, returnSecureToken = true }
            );
            if (!resp.IsSuccessStatusCode) return false; // password wrong

            var authJson = await resp.Content.ReadAsStringAsync();
            var firebaseResp = JsonSerializer.Deserialize<FirebasePasswordChangeResponse>(authJson);

            // 2. Change password in Firebase
            var pwChangeResp = await httpClient.PostAsJsonAsync(
                $"https://identitytoolkit.googleapis.com/v1/accounts:update?key={firebaseApiKey}",
                new { idToken = firebaseResp.idToken, password = newPassword, returnSecureToken = false }
            );
            if (!pwChangeResp.IsSuccessStatusCode) return false;

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeactivateAccountAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAccountAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            try { await FirebaseAuth.DefaultInstance.DeleteUserAsync(user.FirebaseUid); }
            catch { }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        private class FirebasePasswordChangeResponse
        {
            public string idToken { get; set; }
        }
    }
}