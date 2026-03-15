import { Clock, UserCheck, Users, ClipboardList } from "lucide-react";

const CARD_CONFIG = [
  { label: "Pending Verification", color: "bg-orange-500", Icon: Clock },
  { label: "Active Technicians", color: "bg-green-500", Icon: UserCheck },
  { label: "Total Technicians", color: "bg-blue-500", Icon: Users },
  { label: "Unassigned Complaints", color: "bg-red-500", Icon: ClipboardList },
];

export default function StatsOverviewCard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARD_CONFIG.map((card, i) => (
        <div
          key={card.label}
          className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex items-center gap-3"
        >
          <div
            className={`w-12 h-12 flex items-center justify-center ${card.color} rounded-lg`}
          >
            <card.Icon size={24} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-gray-600">{card.label}</div>
            <div className="text-2xl text-gray-900 mt-0.5 font-semibold">
              {stats[i]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
