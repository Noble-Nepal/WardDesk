using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    // Represents a named locality/address with an associated ward number range.
    // e.g. "Shantinagar" covers wards 1–5.
    [Table("ward_areas")]
    public class WardArea
    {
        [Key]
        [Column("ward_area_id")]
        public int WardAreaId { get; set; }

        [Column("address_name")]
        public string AddressName { get; set; } = string.Empty;

        [Column("ward_from")]
        public int WardFrom { get; set; }

        [Column("ward_to")]
        public int WardTo { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
