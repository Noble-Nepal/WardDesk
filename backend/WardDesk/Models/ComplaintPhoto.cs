using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("complaint_photos")]
    public class ComplaintPhoto
    {
        [Key]
        [Column("photo_id")]
        public Guid PhotoId { get; set; }

        [Column("complaint_id")]
        public Guid ComplaintId { get; set; }

        [Column("uploaded_by")]
        public Guid UploadedBy { get; set; }

        [Column("photo_url")]
        public string PhotoUrl { get; set; } = string.Empty;

        [Column("photo_type")]
        public string PhotoType { get; set; } = "complaint";

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ComplaintId")]
        public Complaint? Complaint { get; set; }

        [ForeignKey("UploadedBy")]
        public User? Uploader { get; set; }
    }
}