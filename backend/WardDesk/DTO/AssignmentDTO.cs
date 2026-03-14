namespace WardDesk.DTO
{
    public class AssignmentDTO
    {
        public Guid AssignmentId { get; set; }
        public Guid ComplaintId { get; set; }
        public Guid TechnicianId { get; set; }
        public string TechnicianName { get; set; } = "";
        public Guid AssignedBy { get; set; }
        public string AssignedByName { get; set; } = "";
        public DateTime AssignedAt { get; set; }
        public string? Remarks { get; set; }
    }

}
