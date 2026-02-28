import { HiOutlineX, HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import SidebarUserProfile from "./SidebarUserProfile";
import SidebarNavItem from "./SidebarNavItem";
import {
  citizenNavItems,
  adminNavItems,
  technicianNavItems,
} from "../../../constants/sidebarData";

const navItemsByRole = {
  citizen: citizenNavItems,
  admin: adminNavItems,
  technician: technicianNavItems,
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navItemsByRole[role] || citizenNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar (fixed, slides in) */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiOutlineX className="w-5 h-5 text-gray-400" />
          </button>

          <SidebarUserProfile user={user} role={role} />

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <HiOutlineLogout className="w-5 h-5 shrink-0" />
              <span className="text-sm text-left">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar (sticky, stops at footer) */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-6 h-full flex flex-col">
            <SidebarUserProfile user={user} role={role} />

            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  item={item}
                  onNavigate={handleNavigate}
                />
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <HiOutlineLogout className="w-5 h-5 shrink-0" />
                <span className="text-sm text-left">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
