using System;

namespace WardDesk.DTO
{
    public class TechnicianAssignedComplaintDTO
    {
        public Guid ComplaintId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Address { get; set; }
        public int WardNumber { get; set; }
        public DateTime SubmittedDate { get; set; }
        public string CitizenName { get; set; } = string.Empty;
        public string? ComplaintPhoto { get; set; }
    }
}