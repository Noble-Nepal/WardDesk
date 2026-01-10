namespace WardDesk_Backend.DTO
{
    public class RegisterResponseDTO
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = "";
        public string FullName { get; set; } = "";
        public int? WardNumber { get; set; }
        public string Message { get; set; } = "";
    }
}
