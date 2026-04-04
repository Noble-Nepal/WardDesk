import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  ShieldCheck,
  ShieldX,
  ClipboardList,
  MapPin,
  User,
  CalendarDays,
} from "lucide-react";
import {
  formatDate,
  formatStatus,
  getPriorityClass,
  getStatusClass,
  normalizeStatus,
} from "../../utils/adminComplaintManagementUtils";
import { STATUS_UPDATE_OPTIONS } from "../../constants/adminComplaintManagementConstants";

const ComplaintDetailsPanel = ({
  complaint,
  categories,
  loading,
  actionLoading,
  onVerify,
  onUnverify,
  onUpdateCategory,
  onUpdateStatus,
}) => {
  const [localCategoryId, setLocalCategoryId] = useState("");
  const [localStatus, setLocalStatus] = useState("");

  useEffect(() => {
    if (!complaint) return;
    setLocalCategoryId(
      complaint.categoryId ? String(complaint.categoryId) : "",
    );
    setLocalStatus(normalizeStatus(complaint.statusName));
  }, [complaint]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500">
        Loading complaint details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
        <p className="text-sm text-gray-500">
          Select a complaint to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${getPriorityClass(complaint.priorityLevel)}`}
          >
            {complaint.priorityLevel || "low"}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full border text-xs ${getStatusClass(complaint.statusName)}`}
          >
            {formatStatus(complaint.statusName)}
          </span>

          <span className="ml-auto text-xs inline-flex items-center gap-1">
            {complaint.isVerified ? (
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

        <h2 className="text-lg text-gray-900">
          {complaint.title || "Untitled Complaint"}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {complaint.trackingId || "N/A"}
        </p>
      </div>

      <div className="p-5 space-y-5 overflow-y-auto">
        <div>
          <h3 className="text-sm text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600">
            {complaint.description || "No description provided."}
          </p>
        </div>

        <div>
          <h3 className="text-sm text-gray-900 mb-2">Details</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <ClipboardList className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-gray-900">
                  {complaint.categoryName || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Ward</p>
                <p className="text-sm text-gray-900">
                  Ward {complaint.wardNumber ?? "-"}
                </p>
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-gray-900">
                  {complaint.locationAddress || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Citizen</p>
                <p className="text-sm text-gray-900">
                  {complaint.citizenName || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDays className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {formatDate(complaint.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(complaint.photoUrls) &&
          complaint.photoUrls.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-900 mb-2">
                Photos ({complaint.photoUrls.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {complaint.photoUrls.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Complaint ${i + 1}`}
                      className="w-full h-28 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
        <div className="flex gap-2">
          {complaint.isVerified ? (
            <Button
              variant="outline"
              className="border-red-300 text-red-700"
              onClick={onUnverify}
              disabled={actionLoading}
            >
              Unverify
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={onVerify}
              disabled={actionLoading}
            >
              Verify
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <select
            className="h-10 border border-gray-300 rounded-md px-3 text-sm bg-white"
            value={localCategoryId}
            onChange={(e) => setLocalCategoryId(e.target.value)}
            disabled={actionLoading}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <Button
            className="bg-[#2B4AA0] hover:bg-[#1f3778]"
            onClick={() => onUpdateCategory(Number(localCategoryId))}
            disabled={actionLoading || !localCategoryId}
          >
            Save Category
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <select
            className="h-10 border border-gray-300 rounded-md px-3 text-sm bg-white"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            disabled={actionLoading}
          >
            {STATUS_UPDATE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Button
            className="bg-[#2B4AA0] hover:bg-[#1f3778]"
            onClick={() => onUpdateStatus(localStatus)}
            disabled={actionLoading || !localStatus}
          >
            Save Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPanel;
