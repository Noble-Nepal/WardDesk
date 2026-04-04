import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  STATUS_TABS,
  STATUS_LABELS,
} from "../../constants/technicianDashboardConstants";

export default function TechnicianFilterBar({
  activeTab,
  setActiveTab,
  counts,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-0.5 px-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {STATUS_LABELS[tab]} ({counts[tab] ?? 0})
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 text-sm"
            placeholder="Search by title or ID..."
          />
        </div>
      </div>
    </div>
  );
}
