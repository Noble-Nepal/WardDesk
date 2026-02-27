using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("complaint_categories")]
    public class ComplaintCategory
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("category_name")]
        public string CategoryName { get; set; } = string.Empty;

        [Column("category_description")]
        public string? CategoryDescription { get; set; }

        [Column("safety_guidelines")]
        public string? SafetyGuidelines { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}