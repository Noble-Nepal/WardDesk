using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class UpdateProfileDTO
    {
        
        public string FullName { get; set; }

        public string PhoneNumber { get; set; }
        public int WardNumber { get; set; }
        public string Address { get; set; }
        public string? ProfilePhotoUrl { get; set; }
    }
}