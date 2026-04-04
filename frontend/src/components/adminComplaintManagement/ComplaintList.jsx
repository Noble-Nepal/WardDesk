import { Hash, MapPin, CalendarDays, ShieldCheck, ShieldX } from "lucide-react";
import {
  formatDate,
  formatStatus,
  getPriorityClass,
  getStatusClass,
} from "../../utils/adminComplaintManagementUtils";

const ComplaintList = ({
  complaints,
  selectedComplaintId,
  onSelect,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500">
        Loading complaints...
      </div>
    );
  }

  if (!complaints.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <p className="text-sm text-gray-500">No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((c) => (
        <div
          key={c.complaintId}
          onClick={() => onSelect(c.complaintId)}
          className={`bg-white border rounded-lg p-4 cursor-pointer transition ${
            selectedComplaintId === c.complaintId
              ? "border-[#2B4AA0] ring-1 ring-[#2B4AA0] bg-blue-50/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs text-gray-500 inline-flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {c.trackingId || "N/A"}
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-xs ${getPriorityClass(c.priorityLevel)}`}
            >
              {c.priorityLevel || "low"}
            </span>

            <span
              className={`px-2 py-0.5 rounded-full border text-xs ${getStatusClass(c.statusName)}`}
            >
              {formatStatus(c.statusName)}
            </span>

            <span className="ml-auto text-xs inline-flex items-center gap-1">
              {c.isVerified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Verified</span>
                </>
              ) : (
                <>
                  <ShieldX className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-red-700">Unverified</span>
                </>
              )}
            </span>
          </div>

          <h3 className="text-sm text-gray-900 mb-1 truncate">
            {c.title || "Untitled Complaint"}
          </h3>

          <div className="text-xs text-gray-600 flex items-center flex-wrap gap-3">
            <span>{c.categoryName || "N/A"}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Ward {c.wardNumber ?? "-"}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {formatDate(c.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
