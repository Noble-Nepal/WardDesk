using System.ComponentModel.DataAnnotations;

namespace WardDesk_Backend.DTO
{
    public class RegisterDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = "";

        [Required]
        public string FullName { get; set; } = "";

        [Required]
        public string PhoneNumber { get; set; } = ""; 

        [Required]
        public int WardNumber { get; set; } 
    }
}