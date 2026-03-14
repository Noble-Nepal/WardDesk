using Microsoft.EntityFrameworkCore;
using WardDesk.DTO;
using WardDesk.Database;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WardDesk.Service
{
    public class AnalyticsService
    {
        private readonly AppDbContext _context;

        public AnalyticsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CitizenDashboardAnalyticsDTO> GetCitizenAnalyticsAsync(Guid citizenId)
        {
            var complaints = _context.Complaints.Where(c => c.CitizenId == citizenId);
            int total = await complaints.CountAsync();
            int resolved = await complaints.Where(
                c => c.Status != null &&
                string.Equals(c.Status.StatusName, "resolved", StringComparison.OrdinalIgnoreCase)
            ).CountAsync();
            int pending = await complaints.Where(
                c => c.Status != null &&
                string.Equals(c.Status.StatusName, "pending", StringComparison.OrdinalIgnoreCase)
            ).CountAsync();

            int upvotes = await _context.ComplaintVotes
                .Where(v => v.Complaint != null && v.Complaint.CitizenId == citizenId && v.VoteType == "upvote")
                .CountAsync();

            int downvotes = await _context.ComplaintVotes
                .Where(v => v.Complaint != null && v.Complaint.CitizenId == citizenId && v.VoteType == "downvote")
                .CountAsync();

            double rate = total > 0 ? (resolved * 100.0 / total) : 0;
            return new CitizenDashboardAnalyticsDTO
            {
                TotalComplaints = total,
                ResolvedComplaints = resolved,
                PendingComplaints = pending,
                UpvotesReceived = upvotes,
                DownvotesReceived = downvotes,
                ResolutionRate = rate
            };
        }

        public async Task<TechnicianDashboardAnalyticsDTO> GetTechnicianAnalyticsAsync(Guid technicianId)
        {
            var assignments = await _context.Assignments
                .Include(a => a.Complaint)
                .Where(a => a.TechnicianId == technicianId)
                .ToListAsync();

            int total = assignments.Count;
            int completed = assignments.Count(a => a.Complaint != null &&
                a.Complaint.Status != null &&
                string.Equals(a.Complaint.Status.StatusName, "resolved", StringComparison.OrdinalIgnoreCase));
            int ongoing = assignments.Count(a => a.Complaint != null &&
                a.Complaint.Status != null &&
                !string.Equals(a.Complaint.Status.StatusName, "resolved", StringComparison.OrdinalIgnoreCase));

            var durations = assignments
                .Where(a => a.Complaint != null && a.Complaint.ResolvedAt.HasValue)
                .Select(a => (a.Complaint!.ResolvedAt!.Value - a.AssignedAt).TotalHours);

            double avgTime = durations.Any() ? durations.Average() : 0;
            double rate = total > 0 ? (completed * 100.0 / total) : 0;

            return new TechnicianDashboardAnalyticsDTO
            {
                TotalAssignments = total,
                CompletedAssignments = completed,
                OngoingAssignments = ongoing,
                AvgResolutionTimeHours = avgTime,
                ResolutionRate = rate
            };
        }

        public async Task<AdminDashboardAnalyticsDTO> GetAdminAnalyticsAsync()
        {
            var complaints = await _context.Complaints
                .Include(c => c.Status)
                .Include(c => c.Category)
                .ToListAsync();

            int total = complaints.Count;
            int pending = complaints.Count(
                c => c.Status != null && string.Equals(c.Status.StatusName, "pending", StringComparison.OrdinalIgnoreCase));
            int assigned = complaints.Count(
                c => c.Status != null && string.Equals(c.Status.StatusName, "assigned", StringComparison.OrdinalIgnoreCase));
            int inProgress = complaints.Count(
                c => c.Status != null && string.Equals(c.Status.StatusName, "in progress", StringComparison.OrdinalIgnoreCase));
            int resolved = complaints.Count(
                c => c.Status != null && string.Equals(c.Status.StatusName, "resolved", StringComparison.OrdinalIgnoreCase));

            var durations = complaints
                .Where(c => c.ResolvedAt.HasValue)
                .Select(c => (c.ResolvedAt!.Value - c.CreatedAt).TotalHours);

            double avgTime = durations.Any() ? durations.Average() : 0;

            var assignments = await _context.Assignments
                .Include(a => a.Technician)
                .Include(a => a.Complaint)
                .ToListAsync();

            var techStats = assignments
                .Where(a => a.Technician != null)
                .GroupBy(a => a.Technician!)
                .Select(g => new TechnicianPerformanceDTO
                {
                    TechnicianName = g.Key.FullName,
                    CompletedAssignments = g.Count(a => a.Complaint != null &&
                        a.Complaint.Status != null &&
                        string.Equals(a.Complaint.Status.StatusName, "resolved", StringComparison.OrdinalIgnoreCase)),
                    AvgResolutionTimeHours = g
                        .Where(a => a.Complaint != null && a.Complaint.ResolvedAt.HasValue)
                        .Select(a => (a.Complaint!.ResolvedAt!.Value - a.AssignedAt).TotalHours)
                        .DefaultIfEmpty(0)
                        .Average()
                })
                .OrderByDescending(t => t.CompletedAssignments)
                .ToList();

            var byWard = complaints.GroupBy(c => c.WardNumber.ToString()).ToDictionary(g => g.Key, g => g.Count());
            var byCategory = complaints
                .GroupBy(c => c.Category?.CategoryName ?? "Unknown")
                .ToDictionary(g => g.Key, g => g.Count());
            var byDay = complaints
                .GroupBy(c => c.CreatedAt.Date.ToString("yyyy-MM-dd"))
                .ToDictionary(g => g.Key, g => g.Count());

            return new AdminDashboardAnalyticsDTO
            {
                TotalComplaints = total,
                PendingComplaints = pending,
                AssignedComplaints = assigned,
                InProgressComplaints = inProgress,
                ResolvedComplaints = resolved,
                AvgResolutionTimeHours = avgTime,
                TechnicianPerformances = techStats,
                ComplaintsByWard = byWard,
                ComplaintsByCategory = byCategory,
                ComplaintsByDay = byDay
            };
        }
    }
}