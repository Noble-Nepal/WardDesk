import { Users, UserCheck, Calendar, FileText } from "lucide-react";

const CARD_SKINS = [
  { label: "Total Citizens", bg: "bg-blue-500", Icon: Users },
  { label: "Active Users", bg: "bg-green-500", Icon: UserCheck },
  { label: "New This Month", bg: "bg-purple-500", Icon: Calendar },
  { label: "Total Complaints", bg: "bg-orange-500", Icon: FileText },
];

export default function StatsOverviewCard({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {CARD_SKINS.map(({ label, bg, Icon }, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">{label}</div>
          </div>
          <div className="text-2xl sm:text-3xl text-gray-900">
            {stats[idx] ?? "--"}
          </div>
        </div>
      ))}
    </div>
  );
}
