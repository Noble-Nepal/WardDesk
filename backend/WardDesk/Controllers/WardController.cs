using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WardDesk.DTO;
using WardDesk.Service;

[ApiController]
[Route("api/[controller]")]
public class WardController : ControllerBase
{
    private readonly WardService _wardService;

    public WardController(WardService wardService)
    {
        _wardService = wardService;
    }

    // Public — used by Registration and ReportIssue forms (no auth required)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAreas()
    {
        var areas = await _wardService.GetAllAreasAsync();
        return Ok(areas);
    }

    // Superadmin — add address with ward range
    [HttpPost]
    [Authorize(Roles = "superadmin")]
    public async Task<IActionResult> AddArea([FromBody] CreateWardAreaDTO dto)
    {
        var (ok, error, area) = await _wardService.AddAreaAsync(dto.AddressName, dto.WardFrom, dto.WardTo);
        if (!ok) return BadRequest(new { message = error });
        return Ok(area);
    }

    // Superadmin — delete address
    [HttpDelete("{wardAreaId}")]
    [Authorize(Roles = "superadmin")]
    public async Task<IActionResult> DeleteArea(int wardAreaId)
    {
        var (ok, error) = await _wardService.DeleteAreaAsync(wardAreaId);
        if (!ok) return BadRequest(new { message = error });
        return Ok(new { message = "Address deleted." });
    }
}
