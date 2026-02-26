namespace WardDesk.DTO
{
    public class RegisterResponseDTO
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = "";
        public string FullName { get; set; } = "";
        public int? WardNumber { get; set; }

        public string Address { get; set; } = "";
        public string RoleName { get; set; } = "";
        public bool IsVerified { get; set; }
        public string Message { get; set; } = "";
    }
}
