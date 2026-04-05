import { Eye, Users, MapPin, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
  ACCOUNT_STATUS_META,
  VERIFICATION_META,
} from "../../constants/adminTechnicianConstants";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

export default function TechnicianTable({ technicians, onView }) {
  if (!technicians?.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm py-12 flex flex-col items-center">
        <Users className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No technicians found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left text-xs text-gray-600 px-4 py-3">
              Technician
            </th>
            <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Ward
            </th>
            <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Contact
            </th>
            <th className="text-left text-xs text-gray-600 px-4 py-3">
              Account Status
            </th>
            <th className="hidden sm:table-cell text-left text-xs text-gray-600 px-4 py-3">
              Verification
            </th>
            <th className="text-right text-xs text-gray-600 px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {technicians.map((tech) => {
            const accountKey = String(tech.accountStatus || "").toLowerCase();
            const verificationKey = String(
              tech.verificationStatus || "",
            ).toLowerCase();

            return (
              <tr
                key={tech.userId}
                className="border-b last:border-0 border-gray-100 hover:bg-gray-50"
              >
                {/* Technician */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {tech.profilePhotoUrl ? (
                      <img
                        src={tech.profilePhotoUrl}
                        alt={tech.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-blue-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-[#2B4AA0] text-sm font-semibold flex items-center justify-center shrink-0">
                        {getInitials(tech.fullName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {tech.fullName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {tech.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Ward */}
                <td className="hidden lg:table-cell px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    Ward {tech.wardNumber ?? "-"}
                  </div>
                </td>

                {/* Contact */}
                <td className="hidden lg:table-cell px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {tech.phoneNumber || "-"}
                  </div>
                </td>

                {/* Account Status */}
                <td className="px-4 py-3">
                  <StatusBadge
                    meta={
                      ACCOUNT_STATUS_META[accountKey] ||
                      ACCOUNT_STATUS_META.inactive
                    }
                  />
                </td>

                {/* Verification */}
                <td className="hidden sm:table-cell px-4 py-3">
                  <StatusBadge
                    meta={
                      VERIFICATION_META[verificationKey] ||
                      VERIFICATION_META.unverified
                    }
                  />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onView?.(tech)}
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
