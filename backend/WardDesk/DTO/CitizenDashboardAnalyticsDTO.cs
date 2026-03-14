namespace WardDesk.DTO
{
    public class CitizenDashboardAnalyticsDTO
    {
        public int TotalComplaints { get; set; }
        public int ResolvedComplaints { get; set; }
        public int PendingComplaints { get; set; }
        public int UpvotesReceived { get; set; }
        public int DownvotesReceived { get; set; }
        public double ResolutionRate { get; set; }
    }
}