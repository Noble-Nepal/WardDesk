export default function PerformanceTable({ data }) {
  if (!data || !data.length) {
    return (
      <div className="flex flex-col items-center py-12">
        <svg
          className="w-12 h-12 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
        <div className="text-gray-500 text-center">
          No technician performance data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">
              Rank
            </th>
            <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">
              Technician Name
            </th>
            <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">
              Completed
            </th>
            <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">
              Avg Resolution Time
            </th>
            <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">
              Performance
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((tech, idx) => (
            <tr
              key={tech.TechnicianName}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {idx + 1}
                </span>
              </td>
              <td className="py-4 px-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {tech.TechnicianName.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm text-gray-900 font-medium">
                    {tech.TechnicianName}
                  </div>
                  <div className="text-xs text-gray-500">Active Technician</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium">
                  {tech.CompletedAssignments} tasks
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-900">
                  {tech.AvgResolutionTimeHours
                    ? tech.AvgResolutionTimeHours.toFixed(1) + " hours"
                    : "N/A"}
                </span>
              </td>
              <td className="py-4 px-4">
                {tech.CompletedAssignments ? (
                  <span className="inline-flex items-center text-green-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Excellent
                  </span>
                ) : (
                  <span className="text-gray-400">No data</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
