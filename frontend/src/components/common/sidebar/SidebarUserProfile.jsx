const SidebarUserProfile = ({ user, role }) => {
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const avatarGradient =
    role === "admin"
      ? "bg-gradient-to-br from-purple-500 to-purple-600"
      : "bg-gradient-to-br from-red-500 to-red-600";

  return (
    <div className="mb-6 sm:mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full ${avatarGradient} flex items-center justify-center shadow-md shrink-0`}
        >
          <span className="text-white text-base sm:text-lg font-semibold">
            {initials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.email || "User"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {role || "Citizen"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
