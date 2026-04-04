import { Clock, UserCheck, Users, ClipboardList } from "lucide-react";

const CARD_CONFIG = [
  { label: "Pending Verification", color: "bg-orange-500", Icon: Clock },
  { label: "Active Technicians", color: "bg-[#2B4AA0]", Icon: UserCheck },
  { label: "Total Technicians", color: "bg-gray-600", Icon: Users },
  { label: "Unassigned Complaints", color: "bg-red-500", Icon: ClipboardList },
];

export default function StatsOverviewCard({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARD_CONFIG.map((card, i) => (
        <div
          key={card.label}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center gap-3"
        >
          <div
            className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center shrink-0`}
          >
            <card.Icon className="w-6 h-6 text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-600">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900 leading-tight mt-0.5">
              {stats[i] ?? 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
