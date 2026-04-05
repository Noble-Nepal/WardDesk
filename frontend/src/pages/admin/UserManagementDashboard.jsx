import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import UserTable from "../../components/userManagement/UserTable";
import UserFilterBar from "../../components/userManagement/UserFilterBar";
import UserDetailsModal from "../../components/userManagement/UserDetailsModal";
import ErrorAlert from "../../components/ui/ErrorAlert";
import SuccessToast from "../../components/ui/SuccessToast";

import { fetchCitizens } from "../../api/userApi";
import { updateTechnicianAccountStatus } from "../../api/adminTechnicianApi";
import { Users, UserCheck, UserCog, ClipboardList } from "lucide-react";

const STATS_CONFIG = [
  { label: "Total Users", color: "bg-[#2B4AA0]", Icon: Users },
  { label: "Active Users", color: "bg-emerald-500", Icon: UserCheck },
  { label: "Inactive Users", color: "bg-gray-500", Icon: UserCog },
  { label: "Filtered", color: "bg-red-500", Icon: ClipboardList },
];

function mapUser(u) {
  return {
    id: u.userId,
    name: u.fullName,
    email: u.email,
    phone: u.phoneNumber,
    ward: u.wardNumber,
    address: u.address,
    profilePhoto: u.profilePhotoUrl,
    isActive: u.isActive,
    createdAt: u.createdAt,
    role: (u.role || "citizen").toLowerCase(),
  };
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await fetchCitizens();
      const data = Array.isArray(res) ? res : res.data || [];
      setUsers(data.map(mapUser));
    } catch {
      setPageError("Failed to load users. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleUsers = useMemo(() => {
    let base = users;
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter((u) =>
        [u.name, u.email, u.phone, u.address, String(u.ward ?? "")]
          .map((v) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(q)),
      );
    }
    if (statusFilter === "active") base = base.filter((u) => u.isActive);
    if (statusFilter === "inactive") base = base.filter((u) => !u.isActive);
    return base;
  }, [users, search, statusFilter]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.isActive).length;
    const inactive = users.length - active;
    return [users.length, active, inactive, visibleUsers.length];
  }, [users, visibleUsers]);

  const showSuccess = (title, message) => {
    toast.custom(
      (t) => (
        <div className={t.visible ? "animate-enter" : "animate-leave"}>
          <SuccessToast title={title} message={message} />
        </div>
      ),
      { duration: 3500, style: { padding: "0", background: "transparent", boxShadow: "none" } },
    );
  };

  const handleSave = async ({ isActive }) => {
    if (!selectedUser || isActive === undefined) return;
    setActionLoading(true);
    setPageError("");
    try {
      const reason = isActive
        ? "Your account has been activated by the administrator. You can now log in and use the system."
        : "Your account has been deactivated by the administrator. Please contact support if you believe this is a mistake.";

      await updateTechnicianAccountStatus(selectedUser.id, isActive, reason);
      await loadData();
      setSelectedUser((prev) =>
        prev ? { ...prev, isActive } : null,
      );
      showSuccess(
        isActive ? "Account Activated" : "Account Deactivated",
        `${selectedUser.name} has been ${isActive ? "activated" : "deactivated"}. A notification email has been sent to ${selectedUser.email}.`,
      );
    } catch {
      setPageError("Failed to save changes. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage all registered users
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <ErrorAlert message={pageError} />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS_CONFIG.map(({ label, color, Icon }, i) => (
            <div
              key={label}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-2xl font-semibold text-gray-900">{stats[i]}</div>
              </div>
            </div>
          ))}
        </div>

        <UserFilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <UserTable users={visibleUsers} onView={setSelectedUser} />
        )}
      </div>

      <UserDetailsModal
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleSave}
        actionLoading={actionLoading}
      />
    </div>
  );
}
