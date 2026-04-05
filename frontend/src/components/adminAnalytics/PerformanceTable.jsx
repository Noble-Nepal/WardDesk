import { TrendingUp, Minus } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

const RANK_COLORS = [
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-gray-100 text-gray-600 border-gray-200",
  "bg-orange-100 text-orange-700 border-orange-200",
];

export default function PerformanceTable({ data }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <p className="text-sm text-gray-500">No technician performance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-2.5 px-4 text-xs text-gray-500 font-medium text-left">Rank</th>
            <th className="py-2.5 px-4 text-xs text-gray-500 font-medium text-left">Technician</th>
            <th className="py-2.5 px-4 text-xs text-gray-500 font-medium text-left">Completed</th>
            <th className="py-2.5 px-4 text-xs text-gray-500 font-medium text-left">Avg Resolution</th>
            <th className="py-2.5 px-4 text-xs text-gray-500 font-medium text-left">Performance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tech, idx) => {
            const rankCls = RANK_COLORS[idx] || "bg-blue-50 text-blue-700 border-blue-200";
            const completed = typeof tech.completedAssignments === "number"
              ? tech.completedAssignments
              : 0;
            const avgTime = typeof tech.avgResolutionTimeHours === "number"
              ? tech.avgResolutionTimeHours.toFixed(1) + " hrs"
              : "N/A";

            return (
              <tr
                key={tech.technicianName || idx}
                className="border-b last:border-0 border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full border text-xs font-semibold ${rankCls}`}>
                    {idx + 1}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-[#2B4AA0] text-xs font-semibold flex items-center justify-center shrink-0">
                      {getInitials(tech.technicianName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tech.technicianName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">Active Technician</p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {completed} tasks
                  </span>
                </td>

                <td className="py-3 px-4 text-sm text-gray-700">{avgTime}</td>

                <td className="py-3 px-4">
                  {completed > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Excellent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Minus className="w-3.5 h-3.5" />
                      No data
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
