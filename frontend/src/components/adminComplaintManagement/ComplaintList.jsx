import { Eye, ClipboardList, MapPin, CalendarDays, ShieldCheck, ShieldX } from "lucide-react";
import {
  formatDate,
  formatStatus,
  getPriorityClass,
  getStatusClass,
} from "../../utils/adminComplaintManagementUtils";

const ComplaintList = ({ complaints, onView, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm py-12 text-center">
        <p className="text-sm text-gray-500">Loading complaints...</p>
      </div>
    );
  }

  if (!complaints.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm py-12 flex flex-col items-center">
        <ClipboardList className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No complaints found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <h2 className="text-sm font-medium text-gray-900">
          {complaints.length} Complaint{complaints.length !== 1 ? "s" : ""} Found
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs text-gray-600 px-4 py-3">
                Complaint
              </th>
              <th className="hidden md:table-cell text-left text-xs text-gray-600 px-4 py-3">
                Category
              </th>
              <th className="hidden sm:table-cell text-left text-xs text-gray-600 px-4 py-3">
                Ward
              </th>
              <th className="text-left text-xs text-gray-600 px-4 py-3">
                Status
              </th>
              <th className="hidden md:table-cell text-left text-xs text-gray-600 px-4 py-3">
                Verified
              </th>
              <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
                Address
              </th>
              <th className="hidden lg:table-cell text-left text-xs text-gray-600 px-4 py-3">
                Date
              </th>
              <th className="text-right text-xs text-gray-600 px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr
                key={c.complaintId}
                className="border-b last:border-0 border-gray-100 hover:bg-gray-50"
              >
                {/* Complaint title + tracking + priority */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-50">
                    {c.title || "Untitled Complaint"}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    #{c.trackingId || "N/A"}
                  </div>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${getPriorityClass(c.priorityLevel)}`}
                  >
                    {c.priorityLevel || "low"}
                  </span>
                </td>

                {/* Category */}
                <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-700">
                  {c.categoryName || "N/A"}
                </td>

                {/* Ward */}
                <td className="hidden sm:table-cell px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Ward {c.wardNumber ?? "-"}
                  </div>
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs ${getStatusClass(c.statusName)}`}
                  >
                    {formatStatus(c.statusName)}
                  </span>
                </td>

                {/* Address */}
                <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-700 max-w-40 truncate">
                  {c.locationAddress || "-"}
                </td>

                {/* Verified badge */}
                <td className="hidden md:table-cell px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-xs">
                    {c.isVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <ShieldX className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-red-600">Unverified</span>
                      </>
                    )}
                  </span>
                </td>

                {/* Date */}
                <td className="hidden lg:table-cell px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                    {formatDate(c.createdAt)}
                  </div>
                </td>

                {/* View button */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onView?.(c.complaintId)}
                      className="h-8 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center text-sm"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintList;
