namespace WardDesk.DTO
{
    public class TechnicianDashboardAnalyticsDTO
    {
        public int TotalAssignments { get; set; }
        public int CompletedAssignments { get; set; }
        public int OngoingAssignments { get; set; }
        public double AvgResolutionTimeHours { get; set; }
        public double ResolutionRate { get; set; }
    }
}