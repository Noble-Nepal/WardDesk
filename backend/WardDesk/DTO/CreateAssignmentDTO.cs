namespace WardDesk.DTO
{
    public class CreateAssignmentDTO
    {
        public Guid ComplaintId { get; set; }
        public Guid TechnicianId { get; set; }
        public string? Remarks { get; set; }
    }
}
