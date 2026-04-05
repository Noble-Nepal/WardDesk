import { useEffect, useRef, useState } from "react";
import { X, Shield, Loader2 } from "lucide-react";

const ROLES = [
  { label: "Citizen", value: "citizen", id: 1 },
  { label: "Technician", value: "technician", id: 2 },
  { label: "Admin", value: "admin", id: 3 },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export default function EditUserModal({ open, user, loading, onClose, onSave }) {
  const ref = useRef();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (!open || !user) return;
    setSelectedRole(user.role || "citizen");
    setSelectedStatus(user.isActive ? "active" : "inactive");
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && !loading && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose, loading]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && !loading && onClose?.();
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose, loading]);

  if (!open || !user) return null;

  const currentRole = user.role || "citizen";
  const currentStatus = user.isActive ? "active" : "inactive";
  const roleChanged = selectedRole !== currentRole;
  const statusChanged = selectedStatus !== currentStatus;
  const hasChanges = roleChanged || statusChanged;

  const handleSave = () => {
    if (!hasChanges || loading) return;
    const payload = {};
    if (roleChanged) {
      const roleObj = ROLES.find((r) => r.value === selectedRole);
      payload.roleId = roleObj?.id;
    }
    if (statusChanged) {
      payload.isActive = selectedStatus === "active";
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div
        ref={ref}
        className="w-full max-w-md bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#2B4AA0] px-6 py-5 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Edit User</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Update role and account status
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={!!loading}
            className="text-blue-200 hover:text-white disabled:opacity-40 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* User identity */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-blue-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#2B4AA0] font-semibold text-base flex items-center justify-center shrink-0">
                {getInitials(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={!!loading}
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {roleChanged && (
              <div className="flex items-start gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Role will change from{" "}
                <span className="capitalize font-medium">{currentRole}</span> to{" "}
                <span className="capitalize font-medium">{selectedRole}</span>
              </div>
            )}
          </div>

          {/* Account status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={!!loading}
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={!!loading}
            className="h-9 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || !!loading}
            className="h-9 px-4 rounded-lg bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
