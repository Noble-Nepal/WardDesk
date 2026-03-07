import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { MdClose } from "react-icons/md";

const HeaderSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Debounce: emit search after user stops typing (300ms)
  useEffect(() => {
    if (!onSearch) return;
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <>
      {/* Mobile: Search Icon → expands to full bar */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HiOutlineSearch className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Mobile: Expanded Search Bar */}
      {mobileOpen && (
        <div className="md:hidden flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search complaints..."
              autoFocus
              className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <MdClose className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setMobileOpen(false);
              handleClear();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Tablet+: Full Search Bar */}
      <div className="hidden md:block relative w-64 lg:w-80">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues, complaints..."
          className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <MdClose className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </>
  );
};

export default HeaderSearch;
