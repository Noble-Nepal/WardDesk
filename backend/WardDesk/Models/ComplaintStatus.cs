using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("complaint_status")]
    public class ComplaintStatus
    {
        [Key]
        [Column("status_id")]
        public int StatusId { get; set; }

        [Column("status_name")]
        public string StatusName { get; set; } = string.Empty;

        [Column("status_description")]
        public string? StatusDescription { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}