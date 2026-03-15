import {
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  UserCheck,
  UserX,
  Eye,
  Users,
  AlertCircle,
  Home,
} from "lucide-react";

function statusBadge(status) {
  if (!status)
    return {
      color: "bg-gray-100 text-gray-400 border border-gray-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      label: "Unknown",
    };
  const s = status.toLowerCase();
  if (s === "pending")
    return {
      color: "bg-orange-100 text-orange-700 border border-orange-200",
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: "Pending",
    };
  if (s === "active")
    return {
      color: "bg-green-100 text-green-700 border border-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "Active",
    };
  if (s === "verified")
    return {
      color: "bg-blue-100 text-blue-700 border border-blue-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "Verified",
    };
  return {
    color: "bg-gray-100 text-gray-400 border border-gray-200",
    icon: <AlertCircle className="w-3 h-3 mr-1" />,
    label: status,
  };
}

export default function TechnicianTable({
  technicians,
  onView,
  onApprove,
  onReject,
}) {
  if (!technicians || !technicians.length)
    return (
      <div className="flex flex-col items-center py-12">
        <Users className="w-12 h-12 text-gray-300 mb-4" />
        <div className="text-sm text-gray-500">No technicians found</div>
      </div>
    );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-left">
              Technician
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-left">
              Contact
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-left">
              Ward
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-left">
              Status
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-left">
              Address
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-600 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((tech) => {
            const initials = (tech.fullName || tech.email || "T")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const badge = statusBadge(tech.status || tech.Status);

            return (
              <tr
                key={tech.userId || tech.UserId}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 min-w-45">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center uppercase">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm text-gray-900 font-medium">
                        {tech.fullName}
                      </div>
                      <div className="text-xs text-gray-500">{tech.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 min-w-31.25 align-middle">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {tech.phoneNumber || "-"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 min-w-22.5 align-middle">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-900">
                      {tech.wardNumber || "-"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 min-w-30 align-middle">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </td>
                <td className="py-3 px-4 min-w-45 align-middle">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-900">
                      {tech.address || "-"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right min-w-62.5 align-middle">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      className="h-8 px-3 flex items-center border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                      onClick={() => onView?.(tech)}
                      tabIndex={0}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </button>
                    {(tech.status === "pending" ||
                      tech.Status === "pending") && (
                      <>
                        <button
                          className="h-8 px-3 flex items-center bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                          onClick={() => onApprove?.(tech)}
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                        </button>
                        <button
                          className="h-8 px-3 flex items-center bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                          onClick={() => onReject?.(tech)}
                        >
                          <UserX className="w-3.5 h-3.5 mr-1" /> Reject
                        </button>
                      </>
                    )}
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
