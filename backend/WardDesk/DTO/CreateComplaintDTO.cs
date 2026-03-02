using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class CreateComplaintDTO
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "";

        public string? Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationAddress { get; set; }
        public int? WardNumber { get; set; }
        public string? PriorityLevel { get; set; }

        /// <summary>
        /// Photo URLs uploaded to Cloudinary from frontend
        /// </summary>
        public List<string>? PhotoUrls { get; set; }
    }
}