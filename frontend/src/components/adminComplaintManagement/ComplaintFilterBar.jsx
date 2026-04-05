import { Search } from "lucide-react";
import {
  STATUS_FILTER_OPTIONS,
  VERIFIED_FILTER_OPTIONS,
} from "../../constants/adminComplaintManagementConstants";

const ComplaintFilterBar = ({ filters, setFilters, categories, onClear }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
          }
          placeholder="Search by title, tracking ID..."
          className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg w-full focus:outline-none text-sm"
        />
      </div>

      {/* Filters + Clear */}
      <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:items-center">
        <select
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm bg-white focus:outline-none text-gray-700"
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
        >
          {STATUS_FILTER_OPTIONS.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm bg-white focus:outline-none text-gray-700"
          value={filters.categoryId}
          onChange={(e) =>
            setFilters((p) => ({ ...p, categoryId: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <select
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm bg-white focus:outline-none text-gray-700"
          value={filters.verified}
          onChange={(e) =>
            setFilters((p) => ({ ...p, verified: e.target.value }))
          }
        >
          {VERIFIED_FILTER_OPTIONS.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onClear}
          className="h-9 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ComplaintFilterBar;
