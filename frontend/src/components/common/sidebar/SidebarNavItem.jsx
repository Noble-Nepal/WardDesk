import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineFolderOpen,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

const iconMap = {
  LayoutDashboard: HiOutlineViewGrid,
  FileText: HiOutlineDocumentText,
  Settings: HiOutlineCog,
  BarChart3: HiOutlineChartBar,
  Users: HiOutlineUsers,
  Wrench: HiOutlineWrenchScrewdriver,
  FolderOpen: HiOutlineFolderOpen,
};

const SidebarNavItem = ({ item, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === item.path;
  const Icon = iconMap[item.icon];

  const handleClick = () => {
    navigate(item.path);
    if (onNavigate) onNavigate();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 py-3 rounded-lg transition-all border-l-4 ${
        isActive
          ? "bg-red-50 text-red-600 border-red-600 pl-2 sm:pl-3"
          : "text-gray-700 border-transparent px-3 sm:px-4 hover:bg-gray-50"
      }`}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span className="text-sm text-left flex-1 truncate">{item.label}</span>
      {isActive && <HiOutlineChevronRight className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default SidebarNavItem;
