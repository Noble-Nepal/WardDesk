using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WardDesk.DTO;
using WardDesk.Service;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplaintController : ControllerBase
    {
        private readonly ComplaintService _complaintService;

        public ComplaintController(ComplaintService complaintService)
        {
            _complaintService = complaintService;
        }
        /// <summary>
        /// POST api/complaint — Citizen creates a new complaint
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "citizen")]
        public async Task<ActionResult<ComplaintResponseDTO>> CreateComplaint([FromBody] CreateComplaintDTO request)
        {
            try
            {
                var citizenId = GetUserId();
                var result = await _complaintService.CreateComplaintAsync(citizenId, request);
                return CreatedAtAction(nameof(GetComplaintByTrackingId), new { trackingId = result.TrackingId }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        /// <summary>
        /// GET api/complaint/my — Get all complaints for the logged-in citizen
        /// </summary>
        [HttpGet("my")]
        [Authorize(Roles = "citizen")]
        public async Task<ActionResult<List<ComplaintResponseDTO>>> GetMyComplaints()
        {
            try
            {
                var citizenId = GetUserId();
                var complaints = await _complaintService.GetComplaintsByCitizenAsync(citizenId);
                return Ok(complaints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        /// <summary>
        /// GET api/complaint/track/{trackingId} — Track complaint by tracking ID (public)
        /// </summary>
        [HttpGet("track/{trackingId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ComplaintResponseDTO>> GetComplaintByTrackingId(string trackingId)
        {
            try
            {
                var complaint = await _complaintService.GetComplaintByTrackingIdAsync(trackingId);
                if (complaint == null)
                    return NotFound(new { message = "No complaint found with this tracking ID." });

                return Ok(complaint);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        /// <summary>
        /// GET api/complaint — Get all complaints (admin/technician view)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "admin,technician")]
        public async Task<ActionResult<List<ComplaintResponseDTO>>> GetAllComplaints()
        {
            try
            {
                var complaints = await _complaintService.GetAllComplaintsAsync();
                return Ok(complaints);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }
        /// <summary>
        //Impact of the user with context to issuing complaints
        /// </summary>
        [HttpGet("impact-stats")]
        [Authorize(Roles = "citizen")]
        public async Task<IActionResult> GetImpactStats([FromQuery] Guid citizenId)
        {
            var stats = await _complaintService.GetImpactStatsAsync(citizenId);
            return Ok(stats);
        }


        /// <summary>
        /// GET api/complaint/categories — Get all active complaint categories
        /// </summary>
        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<ActionResult> GetCategories(
            [FromServices] Database.AppDbContext context)
        {
            try
            {
                var categories = await context.ComplaintCategories
                    .Where(c => c.IsActive)
                    .Select(c => new
                    {
                        c.CategoryId,
                        c.CategoryName,
                        c.CategoryDescription,
                        c.SafetyGuidelines
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("Invalid token");
            return Guid.Parse(userIdClaim);
        }
    }
}