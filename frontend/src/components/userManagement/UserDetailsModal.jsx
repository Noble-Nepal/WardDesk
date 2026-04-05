import { useEffect, useRef, useState } from "react";
import { X, MapPin, Phone, Hash, Calendar, Mail, Loader2 } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const ROLE_META = {
  admin: { cls: "bg-purple-100 text-purple-700 border-purple-200", label: "Admin" },
  technician: { cls: "bg-blue-100 text-blue-700 border-blue-200", label: "Technician" },
  citizen: { cls: "bg-gray-100 text-gray-700 border-gray-200", label: "Citizen" },
};

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2B4AA0] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

export default function UserDetailsModal({ open, user, onClose, onSave, actionLoading }) {
  const ref = useRef();
  const [statusValue, setStatusValue] = useState("active");

  useEffect(() => {
    if (!open || !user) return;
    setStatusValue(user.isActive ? "active" : "inactive");
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && !actionLoading && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose, actionLoading]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && !actionLoading && onClose?.();
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose, actionLoading]);

  if (!open || !user) return null;

  const roleMeta = ROLE_META[(user.role || "citizen").toLowerCase()] || ROLE_META.citizen;
  const currentStatus = user.isActive ? "active" : "inactive";
  const statusChanged = statusValue !== currentStatus;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div
        ref={ref}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl flex flex-col"
      >
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">View and manage this user</p>
          </div>
          <button
            onClick={onClose}
            disabled={!!actionLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blue hero banner with profile photo */}
        <div className="bg-[#2B4AA0] px-6 py-5 shrink-0">
          <div className="flex items-center gap-4">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 text-white text-xl font-bold flex items-center justify-center shrink-0">
                {getInitials(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${roleMeta.cls}`}>
                  {roleMeta.label}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                    user.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white truncate">{user.name || "Unknown User"}</h3>
              <p className="text-sm text-blue-200 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Information
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField icon={Hash} label="User ID" value={user.id} />
              <InfoField icon={Mail} label="Email" value={user.email} />
              <InfoField icon={Phone} label="Phone" value={user.phone} />
              <InfoField icon={MapPin} label="Ward" value={`Ward ${user.ward ?? "-"}`} />
              <InfoField icon={MapPin} label="Address" value={user.address} />
              <InfoField
                icon={Calendar}
                label="Joined"
                value={
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"
                }
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t border-gray-200 pt-4">
            {actionLoading && (
              <div className="mb-3 flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving changes…
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Account Status</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enable or disable this user's access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  disabled={!!actionLoading}
                  className="h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={() => onSave?.({ isActive: statusValue === "active" })}
                  disabled={!statusChanged || !!actionLoading}
                  className="h-9 px-4 rounded-lg bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            disabled={!!actionLoading}
            className="h-9 px-5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 text-sm disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
