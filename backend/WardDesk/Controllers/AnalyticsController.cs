using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WardDesk.Service;
using WardDesk.DTO;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/analytics")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AnalyticsService _analyticsService;

        public AnalyticsController(AnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("citizen-dashboard")]
        [Authorize(Roles = "citizen")]
        public async Task<ActionResult<CitizenDashboardAnalyticsDTO>> GetCitizenAnalytics()
        {
            var citizenId = GetUserId();
            var analytics = await _analyticsService.GetCitizenAnalyticsAsync(citizenId);
            return Ok(analytics);
        }

        [HttpGet("technician-dashboard")]
        [Authorize(Roles = "technician")]
        public async Task<ActionResult<TechnicianDashboardAnalyticsDTO>> GetTechnicianAnalytics()
        {
            var techId = GetUserId();
            var analytics = await _analyticsService.GetTechnicianAnalyticsAsync(techId);
            return Ok(analytics);
        }

        [HttpGet("admin-dashboard")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AdminDashboardAnalyticsDTO>> GetAdminAnalytics()
        {
            var analytics = await _analyticsService.GetAdminAnalyticsAsync();
            return Ok(analytics);
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