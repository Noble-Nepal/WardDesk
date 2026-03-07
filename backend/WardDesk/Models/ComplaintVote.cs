using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WardDesk.Models
{
    [Table("complaint_votes")]
    public class ComplaintVote
    {
        [Key]
        [Column("vote_id")]
        public Guid VoteId { get; set; }

        [Column("complaint_id")]
        public Guid ComplaintId { get; set; }

        [Column("user_id")]
        public Guid UserId { get; set; }

        /// <summary>
        /// "upvote" or "downvote"
        /// </summary>
        [Column("vote_type")]
        public string VoteType { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ComplaintId")]
        public Complaint? Complaint { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}