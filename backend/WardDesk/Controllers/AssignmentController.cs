using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
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
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("complaint/{complaintId}")]
        public async Task<ActionResult<List<AssignmentDTO>>> GetAssignmentsForComplaint(Guid complaintId)
        {
            var result = await _assignmentService.GetAssignmentsForComplaint(complaintId);
            return Ok(result);
        }

        [HttpGet("{assignmentId}")]
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
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("Invalid token");
            return Guid.Parse(userIdClaim);
        }
    }
}