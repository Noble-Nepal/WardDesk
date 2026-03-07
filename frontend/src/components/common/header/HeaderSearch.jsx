import { useState, useEffect, useRef } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { MdClose } from "react-icons/md";

const HeaderSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounce: fire search 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current?.(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    onSearchRef.current?.("");
  };

  // Immediate search on Enter key
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchRef.current?.(query.trim());
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
          <form onSubmit={handleSubmit} className="relative flex-1">
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
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <MdClose className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </form>
          <button
            type="button"
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
      <form
        onSubmit={handleSubmit}
        className="hidden md:block relative w-64 lg:w-80"
      >
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
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <MdClose className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>
    </>
  );
};

export default HeaderSearch;
