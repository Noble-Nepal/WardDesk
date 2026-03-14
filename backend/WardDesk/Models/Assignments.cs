using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("assignments")]
    public class Assignment
    {
        [Key]
        [Column("assignment_id")]
        public Guid AssignmentId { get; set; }

        [Column("complaint_id")]
        public Guid ComplaintId { get; set; }

        [Column("technician_id")]
        public Guid TechnicianId { get; set; }

        [Column("assigned_by")]
        public Guid AssignedBy { get; set; }

        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        [Column("remarks")]
        public string? Remarks { get; set; }

        // Navigation Properties
        [ForeignKey("ComplaintId")]
        public Complaint? Complaint { get; set; }

        [ForeignKey("TechnicianId")]
        public User? Technician { get; set; }

        [ForeignKey("AssignedBy")]
        public User? Assigner { get; set; }
    }
}