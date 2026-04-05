import { Eye, Users, MapPin } from "lucide-react";

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

const STATUS_META = {
  active: { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Active" },
  inactive: { cls: "bg-red-50 text-red-600 border-red-200", label: "Inactive" },
};

export default function UserTable({ users, onView }) {
  if (!users?.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm py-12 flex flex-col items-center">
        <Users className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left text-xs text-gray-600 px-4 py-3">User</th>
            <th className="hidden sm:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Role
            </th>
            <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Contact
            </th>
            <th className="text-left text-xs text-gray-600 px-4 py-3">
              Status
            </th>
            <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Joined
            </th>
            <th className="text-right text-xs text-gray-600 px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const roleMeta =
              ROLE_META[(u.role || "citizen").toLowerCase()] || ROLE_META.citizen;
            const statusMeta = u.isActive ? STATUS_META.active : STATUS_META.inactive;

            return (
              <tr
                key={u.id}
                className="border-b last:border-0 border-gray-100 hover:bg-gray-50"
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.profilePhoto ? (
                      <img
                        src={u.profilePhoto}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-blue-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-[#2B4AA0] text-sm font-semibold flex items-center justify-center shrink-0">
                        {getInitials(u.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {u.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {u.email}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        Ward {u.ward ?? "-"}
                        {u.address && (
                          <span className="truncate max-w-32 ml-1">
                            · {u.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="hidden sm:table-cell px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs inline-block ${roleMeta.cls}`}
                  >
                    {roleMeta.label}
                  </span>
                </td>

                {/* Contact */}
                <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-700">
                  {u.phone || "-"}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs inline-block ${statusMeta.cls}`}
                  >
                    {statusMeta.label}
                  </span>
                </td>

                {/* Joined */}
                <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-500">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onView?.(u)}
                      className="h-8 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center text-sm"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
