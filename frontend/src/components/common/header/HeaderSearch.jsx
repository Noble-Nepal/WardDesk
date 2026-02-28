import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

const HeaderSearch = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Mobile: Search Icon Only */}
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <HiOutlineSearch className="w-5 h-5 text-gray-600" />
      </button>

      {/* Tablet+: Full Search Bar */}
      <div className="hidden md:block relative w-64 lg:w-80">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues, complaints..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
      </div>
    </>
  );
};

export default HeaderSearch;
