import { useNavigate } from "react-router-dom";

const PROFILE_PATHS = {
  admin: "/admin/profile-settings",
  superadmin: "/superadmin/profile-settings",
  technician: "/technician/profile-settings",
  citizen: "/citizen/profile-settings",
};

const HeaderUserProfile = ({ user, role }) => {
  const navigate = useNavigate();
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const avatarBg = role === "admin" ? "bg-purple-600" : "bg-red-600";
  const profilePath = PROFILE_PATHS[role] || "/citizen/profile-settings";

  return (
    <button
      onClick={() => navigate(profilePath)}
      className="flex items-center gap-3 border-l border-gray-200 pl-4 hover:opacity-80 transition-opacity"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0">
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
            <span className="text-white text-xs sm:text-sm font-semibold">
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="hidden lg:flex flex-col text-left">
        <span className="text-sm font-medium text-gray-900 leading-tight">
          {user?.email || "User"}
        </span>
        <span className="text-xs text-gray-500 capitalize">{role}</span>
      </div>
    </button>
  );
};

export default HeaderUserProfile;
