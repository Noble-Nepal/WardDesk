import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="WardDesk" className="h-8 w-auto" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            WardDesk
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
            <span>नेपाली</span>
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
