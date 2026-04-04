namespace WardDesk.DTO
{
    public class AdminComplaintListItemDTO
    {
        public Guid ComplaintId { get; set; }
        public string TrackingId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }

        public string StatusName { get; set; } = string.Empty;
        public int StatusId { get; set; }

        public string PriorityLevel { get; set; } = "normal";
        public bool IsVerified { get; set; }

        public string CitizenName { get; set; } = string.Empty;
        public Guid CitizenId { get; set; }

        public int WardNumber { get; set; }
        public string? LocationAddress { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }

        public List<string> PhotoUrls { get; set; } = new();
    }
}