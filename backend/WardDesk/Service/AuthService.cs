using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using WardDesk.DTO;
using WardDesk.Database;

using WardDesk.Models;

namespace WardDesk.Service
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthService(
           AppDbContext context,
           IConfiguration configuration,
           IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<RegisterResponseDTO> RegisterAsync(RegisterDTO request)
        {
            
            var roleType = request.RoleType.ToLower().Trim();
            if (roleType != "citizen" && roleType != "technician")
                throw new InvalidOperationException("Invalid role type. Only 'citizen' or 'technician' are allowed.");


            if (roleType == "technician" && string.IsNullOrWhiteSpace(request.CitizenshipPhotoUrl))
                throw new InvalidOperationException("Citizenship photo is required for technician registration.");

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already registered");

          
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleType);
            if (role == null)
                throw new InvalidOperationException($"Role '{roleType}' not found in the system.");

            UserRecord firebaseUser;
            try
            {
                firebaseUser = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs
                {
                    Email = request.Email,
                    Password = request.Password,
                    DisplayName = request.FullName
                });
            }
            catch (FirebaseAuthException ex)
            {
                throw new InvalidOperationException($"Firebase error: {ex.Message}");
            }

            var isCitizen = roleType == "citizen";

            var user = new User
            {
                UserId = Guid.NewGuid(),
                FirebaseUid = firebaseUser.Uid,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                WardNumber = request.WardNumber,
                RoleId = role.RoleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = isCitizen,           
                IsVerified = isCitizen,          
                CitizenshipPhotoUrl = isCitizen ? null : request.CitizenshipPhotoUrl
            };

            _context.Users.Add(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                await FirebaseAuth.DefaultInstance.DeleteUserAsync(firebaseUser.Uid);
                throw new InvalidOperationException($"Database error: {ex.InnerException?.Message ?? ex.Message}");
            }

            return new RegisterResponseDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                FullName = user.FullName,
                Address = user.Address,
                WardNumber = user.WardNumber,
                RoleName = role.RoleName,
                IsVerified = user.IsVerified,
                Message = isCitizen
                    ? "Registration successful!"
                    : "Registration successful! Your account is pending admin verification."
            };
        }

        public async Task<TokenResponseDTO> LoginAsync(LoginDTO request)
        {
            var firebaseUid = await VerifyWithFirebaseAsync(request.Email, request.Password);

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);

            if (user == null)
                throw new InvalidOperationException("User not found.");

           
            if (!user.IsVerified)
                throw new InvalidOperationException("Your account is pending admin verification. Please wait for approval.");


            if (!user.IsActive)
                throw new InvalidOperationException("Your account has been deactivated. Please contact admin.");

            if (user.Role == null)
                throw new InvalidOperationException("User role not loaded");

            return await CreateTokenResponseAsync(user, user.Role.RoleName);
        }

        public async Task<TokenResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request)
        {
            var user = await ValidateRefreshTokenAsync(request.RefreshToken);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid or expired refresh token");

            if (user.Role == null)
                throw new InvalidOperationException("User role not loaded");

            return await CreateTokenResponseAsync(user, user.Role.RoleName);
        }

        public async Task<bool> LogoutAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<User> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new InvalidOperationException("User not found");

            return user;
        }

       
        private async Task<string> VerifyWithFirebaseAsync(string email, string password)
        {
            var firebaseApiKey = _configuration["Firebase:WebApiKey"];
            if (string.IsNullOrEmpty(firebaseApiKey))
                throw new InvalidOperationException("Firebase API Key not configured");

            var firebaseUrl = $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebaseApiKey}";

            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.PostAsJsonAsync(firebaseUrl, new
            {
                email,
                password,
                returnSecureToken = true
            });

            if (!response.IsSuccessStatusCode)
                throw new UnauthorizedAccessException("Invalid email or password");

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<FirebaseLoginResponseDTO>(content);

            if (data == null || string.IsNullOrEmpty(data.localId))
                throw new InvalidOperationException("Invalid Firebase response");

            return data.localId;
        }

        private async Task<User?> ValidateRefreshTokenAsync(string refreshToken)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null ||
                user.RefreshToken != refreshToken ||
                user.RefreshTokenExpiryTime <= DateTime.UtcNow ||
                !user.IsActive)
            {
                return null;
            }

            return user;
        }

        private async Task<TokenResponseDTO> CreateTokenResponseAsync(User user, string roleName)
        {
            var accessToken = CreateToken(user, roleName);
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(user);

            return new TokenResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiry = DateTime.UtcNow.AddMinutes(
                    _configuration.GetValue<int>("Jwt:AccessTokenExpirationMinutes")),
                RefreshTokenExpiry = user.RefreshTokenExpiryTime!.Value,
            };
        }

        private string CreateToken(User user, string roleName)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    _configuration.GetValue<int>("Jwt:AccessTokenExpirationMinutes")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
                _configuration.GetValue<int>("Jwt:RefreshTokenExpirationDays"));
            await _context.SaveChangesAsync();
            return refreshToken;
        }
    }
}