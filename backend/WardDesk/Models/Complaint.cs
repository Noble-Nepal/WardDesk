using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("complaints")]
    public class Complaint
    {
        [Key]
        [Column("complaint_id")]
        public Guid ComplaintId { get; set; }

        [Column("tracking_id")]
        public string TrackingId { get; set; } = string.Empty;

        [Column("citizen_id")]
        public Guid CitizenId { get; set; }

        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("status_id")]
        public int StatusId { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("latitude")]
        public decimal? Latitude { get; set; }

        [Column("longitude")]
        public decimal? Longitude { get; set; }

        [Column("location_address")]
        public string? LocationAddress { get; set; }

        [Column("ward_number")]
        public int WardNumber { get; set; }  

        [Column("priority_level")]
        public string PriorityLevel { get; set; } = "normal";

        [Column("upvote_count")]
        public int UpvoteCount { get; set; } = 0;

        [Column("downvote_count")]
        public int DownvoteCount { get; set; } = 0;

        [Column("net_votes")]
        public int NetVotes { get; set; } = 0;

        [Column("is_verified")]
        public bool IsVerified { get; set; } = false;

        [Column("verified_by")]
        public Guid? VerifiedBy { get; set; }

        [Column("verified_at")]
        public DateTime? VerifiedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("resolved_at")]
        public DateTime? ResolvedAt { get; set; }

        
        [ForeignKey("CitizenId")]
        public User? Citizen { get; set; }

        [ForeignKey("CategoryId")]
        public ComplaintCategory? Category { get; set; }

        [ForeignKey("StatusId")]
        public ComplaintStatus? Status { get; set; }

        [ForeignKey("VerifiedBy")]
        public User? Verifier { get; set; }

        public ICollection<ComplaintPhoto>? Photos { get; set; }
    }
}