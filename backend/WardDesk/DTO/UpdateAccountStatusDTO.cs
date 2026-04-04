namespace WardDesk.DTO
{
    public class UpdateAccountStatusDTO
    {
        public bool IsActive { get; set; }
        public string? Reason { get; set; }
    }
}