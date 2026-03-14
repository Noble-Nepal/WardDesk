using System.Collections.Generic;

namespace WardDesk.DTO
{
    public class AdminDashboardAnalyticsDTO
    {
        public int TotalComplaints { get; set; }
        public int PendingComplaints { get; set; }
        public int AssignedComplaints { get; set; }
        public int InProgressComplaints { get; set; }
        public int ResolvedComplaints { get; set; }
        public double AvgResolutionTimeHours { get; set; }
        public List<TechnicianPerformanceDTO> TechnicianPerformances { get; set; } = new();
        public Dictionary<string, int> ComplaintsByWard { get; set; } = new();
        public Dictionary<string, int> ComplaintsByCategory { get; set; } = new();
        public Dictionary<string, int> ComplaintsByDay { get; set; } = new();
    }
    public class TechnicianPerformanceDTO
    {
        public string TechnicianName { get; set; } = "";
        public int CompletedAssignments { get; set; }
        public double AvgResolutionTimeHours { get; set; }
    }
}