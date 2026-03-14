import { useEffect, useState } from "react";
import { getAdminDashboardAnalytics } from "../../api/analytics";

// AdminAnalytics components
import HeaderSection from "../../components/adminAnalytics/HeaderSection";
import StatsOverviewCard from "../../components/adminAnalytics/StatsOverviewCard";
import AnalyticsChartCard from "../../components/adminAnalytics/AnalyticsChartCard";
import PerformanceTable from "../../components/adminAnalytics/PerformanceTable";

import ComplaintsByCategoryChart from "../../components/adminAnalytics/ComplaintsByCategoryChart";
import StatusPieChart from "../../components/adminAnalytics/StatusPieChart";
import DailyTrendChart from "../../components/adminAnalytics/DailyTrendChart";
import ComplaintsByWardChart from "../../components/adminAnalytics/ComplaintsByWardChart";

function Footer() {
  return (
    <footer className="text-xs text-gray-400 text-center py-4 mt-8 border-t border-gray-100">
      &copy; {new Date().getFullYear()} WardDesk Admin
    </footer>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboardAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const cardConfig = [
    { type: "total", label: "Total Complaints", value: data.TotalComplaints },
    { type: "pending", label: "Pending Review", value: data.PendingComplaints },
    { type: "assigned", label: "Assigned", value: data.AssignedComplaints },
    {
      type: "inProgress",
      label: "In Progress",
      value: data.InProgressComplaints,
    },
    { type: "resolved", label: "Resolved", value: data.ResolvedComplaints },
    {
      type: "avgTime",
      label: "Avg Resolution Time",
      value:
        data.AvgResolutionTimeHours && !isNaN(data.AvgResolutionTimeHours)
          ? data.AvgResolutionTimeHours.toFixed(1) + " hrs"
          : "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderSection
        title="Analytics Dashboard"
        subtitle="Real-time insights and performance metrics"
        right={
          <>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7V3m8 4V3M5 11h14M5 19h14M5 15h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm text-gray-600 ml-2">
              Last updated: Today
            </span>
          </>
        }
      />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {cardConfig.map((card) => (
            <StatsOverviewCard key={card.label} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnalyticsChartCard
            title="Complaints by Category"
            description="Distribution by type"
          >
            <ComplaintsByCategoryChart data={data.ComplaintsByCategory} />
          </AnalyticsChartCard>
          <AnalyticsChartCard
            title="Status Distribution"
            description="Overall progress breakdown"
          >
            <StatusPieChart
              data={{
                Pending: data.PendingComplaints,
                Assigned: data.AssignedComplaints,
                "In Progress": data.InProgressComplaints,
                Resolved: data.ResolvedComplaints,
              }}
            />
          </AnalyticsChartCard>
          <AnalyticsChartCard
            title="Daily Complaints Trend"
            description="New complaints per day"
          >
            <DailyTrendChart data={data.ComplaintsByDay} />
          </AnalyticsChartCard>
          <AnalyticsChartCard
            title="Complaints by Ward"
            description="Workload per ward"
          >
            <ComplaintsByWardChart data={data.ComplaintsByWard} />
          </AnalyticsChartCard>
        </div>

        {/* Technician Performance Table */}
        <AnalyticsChartCard
          title="Technician Performance"
          description="Leaderboard for active technicians"
        >
          <PerformanceTable data={data.TechnicianPerformances} />
        </AnalyticsChartCard>
      </main>
      <Footer />
    </div>
  );
}
