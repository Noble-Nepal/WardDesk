using System.ComponentModel.DataAnnotations;

namespace WardDesk.DTO
{
    public class VoteDTO
    {
        [Required]
        public Guid ComplaintId { get; set; }

        /// <summary>
        /// "upvote" or "downvote"
        /// </summary>
        [Required]
        public string VoteType { get; set; } = "";
    }

    public class VoteResponseDTO
    {
        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int NetVotes { get; set; }
        public string? UserVote { get; set; }  // "upvote", "downvote", or null
    }
}