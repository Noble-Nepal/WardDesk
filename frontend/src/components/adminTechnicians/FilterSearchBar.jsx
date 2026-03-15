export default function FilterSearchBar({
  tab,
  setTab,
  tabCounts,
  search,
  setSearch,
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      {/* Tabs */}
      <div className="flex gap-2">
        {["Pending", "All"].map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              tab === label
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label} ({tabCounts[i]})
          </button>
        ))}
      </div>
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <svg
          className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx={11} cy={11} r={8} />
          <path d="m21 21-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technicians..."
          className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg w-full focus:outline-none text-sm"
        />
      </div>
    </div>
  );
}
