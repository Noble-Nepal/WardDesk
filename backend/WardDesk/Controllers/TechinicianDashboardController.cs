using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using WardDesk.DTO;
using WardDesk.Service;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/technician-dashboard")]
    [Authorize(Roles = "technician")]
    public class TechnicianDashboardController : ControllerBase
    {
        private readonly TechnicianWorkService _technicianWorkService;

        public TechnicianDashboardController(TechnicianWorkService technicianWorkService)
        {
            _technicianWorkService = technicianWorkService;
        }

        [HttpGet("assigned-complaints")]
        public async Task<IActionResult> GetAssignedComplaints()
        {
            try
            {
                var technicianId = GetUserId();
                var list = await _technicianWorkService.GetMyAssignedComplaintsAsync(technicianId);
                return Ok(list);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpPatch("complaints/{complaintId:guid}/status")]
        public async Task<IActionResult> UpdateWorkStatus(Guid complaintId, [FromBody] UpdateWorkStatusDTO dto)
        {
            try
            {
                var technicianId = GetUserId();
                await _technicianWorkService.UpdateWorkStatusAsync(technicianId, complaintId, dto);
                return Ok(new { message = "Work status updated successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpPost("complaints/{complaintId:guid}/work-photo")]
        public async Task<IActionResult> UploadWorkPhoto(Guid complaintId, [FromBody] UploadWorkPhotoDTO dto)
        {
            try
            {
                var technicianId = GetUserId();
                await _technicianWorkService.UploadWorkPhotoAsync(technicianId, complaintId, dto);
                return Ok(new { message = "Work photo uploaded successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim))
                throw new UnauthorizedAccessException("Invalid token.");

            if (!Guid.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid user identifier in token.");

            return userId;
        }
    }
}