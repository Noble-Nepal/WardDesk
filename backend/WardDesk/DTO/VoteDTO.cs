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


}