using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WardDesk.DTO;
using WardDesk.Services;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : Controller
{
    private readonly AdminService _adminService;
    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("pending-technicians")]
    public async Task<ActionResult> GetPendingTechnicians()
    {
        var result = await _adminService.GetPendingTechniciansAsync();
        return Ok(result);
    }

    [HttpPut("verify-technician/{userId}")]
    public async Task<ActionResult> VerifyTechnician(Guid userId)
    {
        var ok = await _adminService.VerifyTechnicianAsync(userId);
        if (!ok) return BadRequest(new { message = "Failed to verify technician." });
        return Ok(new { message = "Technician verified and activated." });
    }

    [HttpPut("reject-technician/{userId}")]
    public async Task<ActionResult> RejectTechnician(Guid userId)
    {
        var ok = await _adminService.RejectTechnicianAsync(userId);
        if (!ok) return BadRequest(new { message = "Failed to reject technician." });
        return Ok(new { message = "Technician rejected and removed." });
    }

    [HttpPut("users/{userId}/account-status")]
    public async Task<IActionResult> UpdateAccountStatus(Guid userId, [FromBody] UpdateAccountStatusDTO dto)
    {
        try
        {
            var result = await _adminService.UpdateAccountStatusAsync(userId, dto.IsActive, dto.Reason);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("users")]
    public async Task<ActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("users/{userId}")]
    public async Task<ActionResult> GetUserById(Guid userId)
    {
        var user = await _adminService.GetUserByIdAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });
        return Ok(user);
    }

    [HttpPut("users/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] int newRoleId)
    {
        var (ok, oldRole, newRole) = await _adminService.UpdateUserRoleAsync(userId, newRoleId);
        if (!ok) return BadRequest(new { message = "Role update failed." });
        return Ok(new { userId, oldRole, newRole });
    }

    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(Guid userId)
    {
        var ok = await _adminService.DeleteUserAsync(userId);
        if (!ok) return NotFound(new { message = "User not found." });
        return Ok(new { message = "User deleted." });
    }

    [HttpGet("citizens")]
    public async Task<ActionResult> GetCitizens()
    {
        var citizens = await _adminService.GetCitizensAsync();
        return Ok(citizens);
    }
}