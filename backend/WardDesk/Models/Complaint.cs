namespace WardDesk_Backend.Models
{
    public class Complaint
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
