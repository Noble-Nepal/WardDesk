using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WardDesk.Service;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "superadmin")]
public class SuperadminController : ControllerBase
{
    private readonly SuperadminService _superadminService;

    public SuperadminController(SuperadminService superadminService)
    {
        _superadminService = superadminService;
    }

    [HttpPut("users/{userId}/assign-role")]
    public async Task<IActionResult> AssignRole(Guid userId, [FromBody] AssignRoleDTO dto)
    {
        var (ok, error, user) = await _superadminService.AssignRoleAsync(userId, dto.NewRoleId);
        if (!ok) return BadRequest(new { message = error });
        return Ok(user);
    }
}

public class AssignRoleDTO
{
    public int NewRoleId { get; set; }
}
