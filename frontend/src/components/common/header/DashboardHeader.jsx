import { HiOutlineMenu } from "react-icons/hi";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderNotification from "./HeaderNotification";
import HeaderUserProfile from "./HeaderUserProfile";
import useAuth from "../../../hooks/useAuth";
const DashboardHeader = ({ onMenuToggle }) => {
  const { user, role } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Menu Button + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiOutlineMenu className="w-5 h-5 text-gray-600" />
          </button>

          <HeaderLogo role={role} />
        </div>

        {/* Center: Search (tablet+) */}
        <div className="flex-1 flex justify-center px-4">
          <HeaderSearch />
        </div>

        {/* Right: Notification + Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderNotification hasUnread={true} />
          <HeaderUserProfile user={user} role={role} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
