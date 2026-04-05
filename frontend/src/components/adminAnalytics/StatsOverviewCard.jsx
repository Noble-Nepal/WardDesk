import { analyticsIconMap } from "../../utils/AnalyticsIcons";

export default function StatsOverviewCard({ type, label, value }) {
  const { Icon, bg } = analyticsIconMap[type];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-2.5">
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${bg}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500 truncate leading-tight">{label}</p>
        <p className="text-lg font-semibold text-gray-900 leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}
