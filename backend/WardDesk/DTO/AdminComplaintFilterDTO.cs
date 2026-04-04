namespace WardDesk.DTO
{
    public class AdminComplaintFilterDTO
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public int? CategoryId { get; set; }
        public bool? IsVerified { get; set; }
        public int? WardNumber { get; set; }
    }
}