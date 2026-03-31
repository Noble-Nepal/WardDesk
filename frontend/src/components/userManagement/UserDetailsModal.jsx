import { X, Edit3 } from "lucide-react";
import { StatusBadge, WardBadge } from "../ui/badges";
import { Button } from "../ui/button";

// Utility for initials fallback
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function UserDetailsModal({
  open,
  onClose,
  citizen,
  onEditProfile,
}) {
  if (!open || !citizen) return null;

  const complaints = Array.isArray(citizen.complaints)
    ? citizen.complaints
    : [];
  const reported = complaints.length;
  const resolved = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "resolved",
  ).length;
  const pending = reported - resolved;
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Profile Header */}
        <section className="bg-blue-50 px-6 pt-6 pb-5 relative rounded-t-xl">
          <button
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-5">
            {citizen.profilePhoto ? (
              <img
                src={citizen.profilePhoto}
                alt={citizen.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 border-blue-200 text-2xl font-bold text-blue-700 shadow">
                {getInitials(citizen.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xl text-gray-900 font-semibold mb-0.5 truncate">
                  {citizen.name || (
                    <span className="text-gray-400">No Name</span>
                  )}
                </div>
                <WardBadge ward={citizen.ward ?? "—"} />
                <StatusBadge
                  status={citizen.isActive ? "active" : "inactive"}
                />
              </div>
              {citizen.address && (
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {citizen.address}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-2 px-6 mt-2 mb-3">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-2.5 text-center">
            <div className="text-lg text-gray-900">{reported}</div>
            <div className="text-xs text-gray-500">Reported</div>
          </div>
          <div className="bg-white rounded border border-gray-200 shadow-sm p-2.5 text-center">
            <div className="text-lg text-green-600">{resolved}</div>
            <div className="text-xs text-gray-500">Resolved</div>
          </div>
          <div className="bg-white rounded border border-gray-200 shadow-sm p-2.5 text-center">
            <div className="text-lg text-yellow-600">{pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </section>

        {/* Contact info */}
        <section className="px-6 pb-1 text-xs">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Contact Information
          </div>
          <ul className="text-sm text-gray-700 space-y-0.5">
            <li>
              <span className="font-medium">Email:</span>{" "}
              {citizen.email || <span className="text-gray-400">—</span>}
            </li>
            <li>
              <span className="font-medium">Phone:</span>{" "}
              {citizen.phone || <span className="text-gray-400">—</span>}
            </li>
            <li>
              <span className="font-medium">Address:</span>{" "}
              {citizen.address || <span className="text-gray-400">—</span>}
            </li>
            <li>
              <span className="font-medium">Ward:</span>{" "}
              {citizen.ward || <span className="text-gray-400">—</span>}
            </li>
            <li>
              <span className="font-medium">Joined:</span>{" "}
              {citizen.createdAt ? (
                new Date(citizen.createdAt).toLocaleDateString()
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </li>
          </ul>
        </section>

        {/* Recent complaints */}
        <section className="px-6 pt-3 pb-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            Recent Complaints ({recentComplaints.length})
          </div>
          {reported === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <svg
                className="w-8 h-8 text-gray-300 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-6a2 2 0 0 1 2-2h2m4 6v-6a2 2 0 0 0-2-2h-2m-4 0H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                No complaints submitted yet
              </p>
            </div>
          ) : (
            <ul>
              {recentComplaints.map((comp, idx) => (
                <li key={comp.complaintId || comp.id || idx} className="py-0.5">
                  <span className="font-medium">
                    {comp.title || comp.subject || "Complaint"}
                  </span>
                  {" — "}
                  <span className="text-xs text-gray-500">
                    {comp.status}{" "}
                    {comp.createdAt &&
                      `(${new Date(comp.createdAt).toLocaleDateString()})`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <footer className="border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="bg-[#2B4AA0] text-white hover:bg-[#1a2d6b]"
            onClick={() => {
              onClose();
              onEditProfile(citizen);
            }}
          >
            <Edit3 className="w-4 h-4 mr-1.5" />
            Edit Profile
          </Button>
        </footer>
      </div>
    </div>
  );
}
