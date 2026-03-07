namespace WardDesk.DTO
{
    public class VoteResponseDTO
    {
        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int NetVotes { get; set; }
        public string? UserVote { get; set; }  // "upvote", "downvote", or null
    }
}
