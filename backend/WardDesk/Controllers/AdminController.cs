

using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardDesk.Database;
namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController(AppDbContext context) : Controller
    {
        private readonly AppDbContext _context = context;

        // GET: api/admin/pending-technicians
        [HttpGet("pending-technicians")]
        public async Task<ActionResult> GetPendingTechnicians()
        {
            try
            {
                var pendingTechnicians = await _context.Users
                    .Include(u => u.Role)
                    .Where(u => u.Role!.RoleName.ToLower() == "technician" && !u.IsVerified)
                    .Select(u => new
                    {
                        u.UserId,
                        u.FullName,
                        u.Email,
                        u.PhoneNumber,
                        u.WardNumber,
                        u.CitizenshipPhotoUrl,
                        u.CreatedAt
                    })
                    .OrderByDescending(u => u.CreatedAt)
                    .ToListAsync();

                return Ok(pendingTechnicians);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // PUT: api/admin/verify-technician/{userId}
        [HttpPut("verify-technician/{userId}")]
        public async Task<ActionResult> VerifyTechnician(Guid userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null)
                    return NotFound(new { message = "User not found." });

                if (user.Role?.RoleName.ToLower() != "technician")
                    return BadRequest(new { message = "This user is not a technician." });

                if (user.IsVerified)
                    return BadRequest(new { message = "This technician is already verified." });

                user.IsVerified = true;
                user.IsActive = true;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = $"Technician '{user.FullName}' has been verified and activated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // PUT: api/admin/reject-technician/{userId}
        [HttpPut("reject-technician/{userId}")]
        public async Task<ActionResult> RejectTechnician(Guid userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null)
                    return NotFound(new { message = "User not found." });

                if (user.Role?.RoleName.ToLower() != "technician")
                    return BadRequest(new { message = "This user is not a technician." });

                if (user.IsVerified)
                    return BadRequest(new { message = "Cannot reject an already verified technician." });

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Technician '{user.FullName}' has been rejected and removed." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }
        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    u.Address,
                    u.WardNumber,
                    Role = u.Role != null ? u.Role.RoleName : null,
                    u.IsActive,
                    u.IsVerified,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }
        [HttpGet("users/{userId}")]
        public async Task<ActionResult> GetUserById(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    u.Address,
                    u.WardNumber,
                    Role = u.Role != null ? u.Role.RoleName : null,
                    u.IsActive,
                    u.IsVerified,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound(new { message = "User not found." });
            return Ok(user);
        }
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] int newRoleId)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (user.RoleId == newRoleId)
                return BadRequest(new { message = "User already has this role." });

            var role = await _context.Roles.FindAsync(newRoleId);
            if (role == null)
                return BadRequest(new { message = "Role not found." });

            user.RoleId = newRoleId;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.UserId,
                oldRole = user.Role != null ? user.Role.RoleName : null,
                newRole = role.RoleName
            });
        }
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!string.IsNullOrEmpty(user.FirebaseUid))
            {
                try
                {
                    await FirebaseAuth.DefaultInstance.DeleteUserAsync(user.FirebaseUid);
                }
                catch (FirebaseAuthException ex)
                {
                    return StatusCode(500, new { message = $"Failed to delete user from Firebase: {ex.Message}" });
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User deleted from system and Firebase." });
        }

    }

}
