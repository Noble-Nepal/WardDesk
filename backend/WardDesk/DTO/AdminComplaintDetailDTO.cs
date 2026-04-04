namespace WardDesk.DTO
{
    public class AdminComplaintDetailDTO : AdminComplaintListItemDTO
    {
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int NetVotes { get; set; }

        public Guid? VerifiedBy { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}