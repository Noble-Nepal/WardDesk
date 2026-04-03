using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class ForgotPasswordRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";
    }
}