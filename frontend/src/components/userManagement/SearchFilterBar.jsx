import { Search, ChevronDown, Filter } from "lucide-react";

const wardOptions = Array.from({ length: 10 }, (_, i) => i + 1);

export default function SearchFilterBar({
  search,
  setSearch,
  ward,
  setWard,
  status,
  setStatus,
  filteredCount,
  totalCount,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="pl-10 bg-gray-50 border border-gray-200 rounded-lg w-full py-2 pr-3 text-sm text-gray-900 focus:outline-none"
            placeholder="Search by name, email, phone, address, or ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search citizens"
          />
        </div>
        {/* --- Mobile filter toggle --- */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center border border-gray-300 text-gray-700 rounded-lg px-3 py-2 gap-2 bg-white"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown
            className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
          />
        </button>
        {/* --- Desktop dropdowns --- */}
        <div className="hidden sm:flex flex-row items-center gap-3">
          {/* Ward */}
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ward}
              onChange={(e) =>
                setWard(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All Wards</option>
              {wardOptions.map((w) => (
                <option key={w} value={w}>
                  Ward {w}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* Status */}
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* --- Mobile dropdowns --- */}
      {mobileFiltersOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-0.5">Ward</label>
              <select
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={ward}
                onChange={(e) =>
                  setWard(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">All Wards</option>
                {wardOptions.map((w) => (
                  <option key={w} value={w}>
                    Ward {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-0.5">Status</label>
              <select
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filtered badge */}
      <div className="mt-3 sm:mt-0 text-right text-sm text-gray-500">
        {filteredCount} of {totalCount} users
      </div>
    </div>
  );
}
