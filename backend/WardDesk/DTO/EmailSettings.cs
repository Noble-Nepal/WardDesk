namespace WardDesk.DTO
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "";
        public int SmtpPort { get; set; } = 587;
        public string SmtpUsername { get; set; } = "";
        public string SmtpPassword { get; set; } = "";
        public string FromEmail { get; set; } = "";
        public string FromName { get; set; } = "WardDesk";
        public bool UseSsl { get; set; } = true;
    }
}