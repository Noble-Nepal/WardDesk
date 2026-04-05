import { useEffect, useState } from "react";
import { getAdminDashboardAnalytics } from "../../api/analytics";
import StatsOverviewCard from "../../components/adminAnalytics/StatsOverviewCard";
import AnalyticsChartCard from "../../components/adminAnalytics/AnalyticsChartCard";
import PerformanceTable from "../../components/adminAnalytics/PerformanceTable";
import ComplaintsByCategoryChart from "../../components/adminAnalytics/ComplaintsByCategoryChart";
import StatusPieChart from "../../components/adminAnalytics/StatusPieChart";
import DailyTrendChart from "../../components/adminAnalytics/DailyTrendChart";
import ComplaintsByWardChart from "../../components/adminAnalytics/ComplaintsByWardChart";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboardAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading analytics...</p>
      </div>
    );
  }

  const cardConfig = [
    { type: "total",      label: "Total Complaints",      value: data.totalComplaints },
    { type: "pending",    label: "Pending Review",         value: data.pendingComplaints },
    { type: "assigned",   label: "Assigned",               value: data.assignedComplaints },
    { type: "inProgress", label: "In Progress",            value: data.inProgressComplaints },
    { type: "resolved",   label: "Resolved",               value: data.resolvedComplaints },
    {
      type: "avgTime",
      label: "Avg Resolution",
      value:
        data.avgResolutionTimeHours && !isNaN(data.avgResolutionTimeHours)
          ? data.avgResolutionTimeHours.toFixed(1) + " hrs"
          : "N/A",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time insights and performance metrics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {cardConfig.map((card) => (
            <StatsOverviewCard key={card.label} {...card} />
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChartCard
            title="Complaints by Category"
            description="Distribution by type"
          >
            <ComplaintsByCategoryChart data={data.complaintsByCategory} />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Status Distribution"
            description="Overall progress breakdown"
          >
            <StatusPieChart
              data={{
                Pending: data.pendingComplaints,
                Assigned: data.assignedComplaints,
                "In Progress": data.inProgressComplaints,
                Resolved: data.resolvedComplaints,
              }}
            />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Daily Complaints Trend"
            description="New complaints per day"
          >
            <DailyTrendChart data={data.complaintsByDay} />
          </AnalyticsChartCard>

          <AnalyticsChartCard
            title="Complaints by Ward"
            description="Workload per ward"
          >
            <ComplaintsByWardChart data={data.complaintsByWard} />
          </AnalyticsChartCard>
        </div>

        {/* Performance table */}
        <AnalyticsChartCard
          title="Technician Performance"
          description="Leaderboard for active technicians"
        >
          <PerformanceTable data={data.technicianPerformances} />
        </AnalyticsChartCard>
      </div>
    </div>
  );
}
