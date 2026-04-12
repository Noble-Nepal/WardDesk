using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WardDesk.Service;

namespace WardDesk.Controllers
{
    public class ActionPlanRequestDTO
    {
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    [ApiController]
    [Route("api/action-plan")]
    [Authorize]
    public class ActionPlanController : ControllerBase
    {
        private readonly ActionPlanService _actionPlanService;

        public ActionPlanController(ActionPlanService actionPlanService)
        {
            _actionPlanService = actionPlanService;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] ActionPlanRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Category))
                return BadRequest(new { message = "Category is required." });

            try
            {
                var result = await _actionPlanService.GenerateAsync(
                    dto.Category,
                    dto.Description ?? ""
                );
                return Ok(result);
            }
            catch
            {
                return StatusCode(500, new { message = "Failed to generate action plan. Please try again." });
            }
        }
    }
}
