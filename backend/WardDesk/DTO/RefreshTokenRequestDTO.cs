using System.ComponentModel.DataAnnotations;

namespace WardDesk_Backend.DTO
{
    public class RefreshTokenRequestDTO
    {
        [Required]
        public string RefreshToken { get; set; } = "";
    }
}
