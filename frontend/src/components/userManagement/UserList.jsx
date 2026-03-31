import { UserTableActions } from "./UserActionButtons";
import { StatusBadge, WardBadge } from "../ui/badges";

function UserAvatar({ profilePhoto, name }) {
  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={name}
        className="w-9 h-9 rounded-full object-cover border border-gray-200 bg-gray-100"
      />
    );
  }
  const initials =
    name && name.trim()
      ? name
          .split(" ")
          .map((w) => w[0]?.toUpperCase())
          .slice(0, 2)
          .join("")
      : "?";
  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-blue-50 text-blue-700 font-bold text-base">
      {initials}
    </div>
  );
}

export default function UserList({
  users = [],
  breakpoint = "desktop",
  onView,
  onEdit,
  onDelete,
}) {
  if (breakpoint !== "desktop") return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto hidden lg:block">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ward / Address
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u, i) => (
            <tr
              key={u.id ?? u.email ?? `row-${i}`}
              className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 group transition`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <UserAvatar profilePhoto={u.profilePhoto} name={u.name} />
                  <div>
                    <div className="text-sm text-gray-900 font-medium">
                      {u.name ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {u.email ?? "—"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {u.phone ?? "—"}
              </td>
              <td className="py-3 px-4 align-middle">
                <div className="flex items-center gap-2">
                  <WardBadge ward={u.ward ?? "—"} />
                  {u.address && (
                    <span className="text-xs text-gray-500">{u.address}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 align-middle">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
              <td className="py-3 px-4 align-middle">
                <StatusBadge status={u.isActive ? "active" : "inactive"} />
              </td>
              <td className="py-3 px-4 text-right align-middle">
                <UserTableActions
                  onView={() => onView(u)}
                  onEdit={() => onEdit(u)}
                  onDelete={() => onDelete(u)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
