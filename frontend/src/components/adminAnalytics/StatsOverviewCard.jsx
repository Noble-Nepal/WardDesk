import { analyticsIconMap } from "../../utils/AnalyticsIcons";

export default function StatsOverviewCard({ type, label, value }) {
  const { Icon, bg } = analyticsIconMap[type];
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-start">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg ${bg} mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-gray-600 mb-1">{label}</span>
      <span className="text-2xl text-gray-900">{value}</span>
    </div>
  );
}
