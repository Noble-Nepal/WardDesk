const SidebarUserProfile = ({ user, role }) => {
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const avatarBg = role === "admin" ? "bg-purple-600" : "bg-red-600";

  return (
    <div className="mb-6 sm:mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md shrink-0">
          {user?.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full ${avatarBg} flex items-center justify-center`}
            >
              <span className="text-white text-base sm:text-lg font-semibold">
                {initials}
              </span>
            </div>
          )}
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
