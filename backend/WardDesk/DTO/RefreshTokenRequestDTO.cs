using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class RefreshTokenRequestDTO
    {
        [Required]
        public string RefreshToken { get; set; } = "";
    }
}
