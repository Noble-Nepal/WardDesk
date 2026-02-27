namespace WardDesk.DTO
{
    public class ComplaintResponseDTO
    {
        public Guid ComplaintId { get; set; }
        public string TrackingId { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public string CategoryName { get; set; } = "";
        public int CategoryId { get; set; }
        public string StatusName { get; set; } = "";
        public int StatusId { get; set; }
        public string PriorityLevel { get; set; } = "";
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationAddress { get; set; }
        public int WardNumber { get; set; }
        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int NetVotes { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public List<string> PhotoUrls { get; set; } = new();
        public string CitizenName { get; set; } = "";
        public Guid CitizenId { get; set; }
    }
}