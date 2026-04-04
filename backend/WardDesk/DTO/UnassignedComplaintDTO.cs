public class UnassignedComplaintDTO
{
    public Guid ComplaintId { get; set; }
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? Priority { get; set; }
    public string? Ward { get; set; }
    public string? Status { get; set; }
    public DateTime SubmittedDate { get; set; }
    public string? CitizenName { get; set; }   
    public string? Photo { get; set; }
    public int? WardNumber { get; set; }
    public string? Address { get; set; }
}