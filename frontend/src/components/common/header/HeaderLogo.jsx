import { Link } from "react-router-dom";

const HeaderLogo = ({ role }) => {
  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "technician"
        ? "/technician/dashboard"
        : "/citizen/dashboard";

  return (
    <Link to={dashboardPath} className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="WardDesk"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-md"
      />
      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
        WardDesk
      </span>
    </Link>
  );
};

export default HeaderLogo;
