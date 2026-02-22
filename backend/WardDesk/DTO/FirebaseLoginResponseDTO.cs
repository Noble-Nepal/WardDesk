namespace WardDesk_Backend.DTO
{
    public class FirebaseLoginResponseDTO
    {
        public string localId { get; set; } = "";
        public string email { get; set; } = "";
        public string idToken { get; set; } = "";
        public string refreshToken { get; set; } = "";
        public string expiresIn { get; set; } = "";
        public bool registered { get; set; }
    }
}

