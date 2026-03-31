using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WardDesk.DTO;
using WardDesk.Services;

namespace WardDesk.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;
        public ProfileController(ProfileService profileService)
        {
            _profileService = profileService;
        }

        private Guid GetUserId()
        {
            return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException());
        }

        // GET: api/profile
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _profileService.GetUserProfileAsync(userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        // PUT: api/profile/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO dto)
        {
            var userId = GetUserId();
            var ok = await _profileService.UpdateUserProfileAsync(userId, dto);
            if (!ok) return NotFound(new { message = "User not found." });
            return NoContent();
        }

        // PUT: api/profile/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var userId = GetUserId();
            var ok = await _profileService.ChangePasswordFirebaseAsync(userId, dto.CurrentPassword, dto.NewPassword);
            if (!ok) return BadRequest(new { message = "Incorrect current password or failed to change password." });
            return NoContent();
        }

        // POST: api/profile/deactivate-account
        [HttpPost("deactivate-account")]
        public async Task<IActionResult> DeactivateAccount()
        {
            var userId = GetUserId();
            var ok = await _profileService.DeactivateAccountAsync(userId);
            if (!ok) return NotFound();
            return Ok(new { message = "Account deactivated." });
        }

        // DELETE: api/profile/delete-account
        [HttpDelete("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = GetUserId();
            var ok = await _profileService.DeleteAccountAsync(userId);
            if (!ok) return NotFound();
            return Ok(new { message = "Account deleted." });
        }
    }
}