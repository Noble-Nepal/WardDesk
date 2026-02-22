using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WardDesk_Backend.Database;
using Microsoft.EntityFrameworkCore;
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
    }
}
