using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class ResetPasswordRequestDTO
    {
        [Required]
        public string OobCode { get; set; } = "";

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = "";
    }
}