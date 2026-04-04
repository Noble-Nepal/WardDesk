using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using WardDesk.Service;
using WardDesk.DTO;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AssignmentController : ControllerBase
    {
        private readonly AssignmentService _assignmentService;

        public AssignmentController(AssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpPost]
        public async Task<ActionResult<AssignmentDTO>> AssignComplaint([FromBody] CreateAssignmentDTO request)
        {
            try
            {
                var adminId = GetUserId();
                var result = await _assignmentService.AssignComplaintAsync(adminId, request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpGet("complaint/{complaintId:guid}")]
        public async Task<ActionResult<List<AssignmentDTO>>> GetAssignmentsForComplaint(Guid complaintId)
        {
            try
            {
                var result = await _assignmentService.GetAssignmentsForComplaint(complaintId);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpGet("{assignmentId:guid}")]
        public async Task<ActionResult<AssignmentDTO>> GetAssignment(Guid assignmentId)
        {
            try
            {
                var assignment = await _assignmentService.GetAssignmentDTOByIdOrThrow(assignmentId);
                return Ok(assignment);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected server error occurred." });
            }
        }

        [HttpGet("unassigned-complaints")]
        public async Task<ActionResult<List<UnassignedComplaintDTO>>> GetUnassignedComplaints()
        {
            try
            {
                var complaints = await _assignmentService.GetUnassignedComplaintsAsync();
                return Ok(complaints);
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