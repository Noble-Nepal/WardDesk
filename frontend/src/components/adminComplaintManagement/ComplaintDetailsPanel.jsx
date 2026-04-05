import { useEffect, useRef, useState } from "react";
import {
  XCircle,
  ShieldCheck,
  ShieldX,
  ClipboardList,
  MapPin,
  User,
  CalendarDays,
  Hash,
  Loader2,
} from "lucide-react";
import {
  formatDate,
  formatStatus,
  getPriorityClass,
  getStatusClass,
  normalizeStatus,
} from "../../utils/adminComplaintManagementUtils";
import { STATUS_UPDATE_OPTIONS } from "../../constants/adminComplaintManagementConstants";

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

const ComplaintDetailsPanel = ({
  open,
  complaint,
  categories,
  loading,
  actionLoading,
  onClose,
  onVerify,
  onUnverify,
  onUpdateCategory,
  onUpdateStatus,
}) => {
  const ref = useRef();
  const [localCategoryId, setLocalCategoryId] = useState("");
  const [localStatus, setLocalStatus] = useState("");

  useEffect(() => {
    if (!complaint) return;
    setLocalCategoryId(
      complaint.categoryId ? String(complaint.categoryId) : "",
    );
    setLocalStatus(normalizeStatus(complaint.statusName));
  }, [complaint]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) =>
      e.key === "Escape" && !actionLoading && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose, actionLoading]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) =>
      ref.current &&
      !ref.current.contains(e.target) &&
      !actionLoading &&
      onClose?.();
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose, actionLoading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div
        ref={ref}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl flex flex-col"
      >
        {/* ── Top bar ── */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Complaint Details
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and manage this complaint
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={!!actionLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#2B4AA0]" />
            Loading complaint details…
          </div>
        ) : !complaint ? (
          <div className="flex-1 flex items-center justify-center py-16 text-sm text-gray-400">
            No complaint data available.
          </div>
        ) : (
          <>
            {/* ── Blue hero banner ── */}
            <div className="bg-[#2B4AA0] px-6 py-5 shrink-0">
              {/* Badges inside the banner */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(complaint.priorityLevel)}`}
                >
                  {complaint.priorityLevel || "low"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${getStatusClass(complaint.statusName)}`}
                >
                  {formatStatus(complaint.statusName)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                    complaint.isVerified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {complaint.isVerified ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldX className="w-3.5 h-3.5" />
                  )}
                  {complaint.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white leading-snug">
                {complaint.title || "Untitled Complaint"}
              </h3>

              {/* Tracking ID */}
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-blue-200">
                <Hash className="w-3.5 h-3.5" />
                {complaint.trackingId || "N/A"}
              </p>
            </div>

            {/* ── Scrollable body ── */}
            <div className="px-6 py-5 space-y-6 overflow-y-auto">
              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {complaint.description || "No description provided."}
                </p>
              </div>

              {/* Details grid */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Details
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField
                    icon={ClipboardList}
                    label="Category"
                    value={complaint.categoryName || "N/A"}
                  />
                  <InfoField
                    icon={MapPin}
                    label="Ward"
                    value={`Ward ${complaint.wardNumber ?? "-"}`}
                  />
                  <InfoField
                    icon={MapPin}
                    label="Address"
                    value={complaint.locationAddress || "N/A"}
                  />
                  <InfoField
                    icon={User}
                    label="Citizen"
                    value={complaint.citizenName || "N/A"}
                  />
                  <InfoField
                    icon={CalendarDays}
                    label="Submitted"
                    value={formatDate(complaint.createdAt)}
                  />
                </div>
              </div>

              {/* Photos */}
              {Array.isArray(complaint.photoUrls) &&
                complaint.photoUrls.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Photos ({complaint.photoUrls.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {complaint.photoUrls.map((url, i) => (
                        <div
                          key={`${url}-${i}`}
                          className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
                        >
                          <img
                            src={url}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* ── Footer actions ── */}
            <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 space-y-3 rounded-b-xl">
              {/* Action loading */}
              {actionLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving changes…
                </div>
              )}

              {/* Verify / Unverify */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Verification
                </span>
                {complaint.isVerified ? (
                  <button
                    onClick={onUnverify}
                    disabled={!!actionLoading}
                    className="h-9 px-4 border border-red-300 text-red-700 rounded-lg bg-white hover:bg-red-50 text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2 transition-colors"
                  >
                    <ShieldX className="w-4 h-4" />
                    Unverify
                  </button>
                ) : (
                  <button
                    onClick={onVerify}
                    disabled={!!actionLoading}
                    className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Mark as Verified
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Category + Status in a 2-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
                      value={localCategoryId}
                      onChange={(e) => setLocalCategoryId(e.target.value)}
                      disabled={!!actionLoading}
                    >
                      <option value="">Select…</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onUpdateCategory(Number(localCategoryId))}
                      disabled={!!actionLoading || !localCategoryId}
                      className="h-9 px-3 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium disabled:opacity-60 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
                      value={localStatus}
                      onChange={(e) => setLocalStatus(e.target.value)}
                      disabled={!!actionLoading}
                    >
                      {STATUS_UPDATE_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onUpdateStatus(localStatus)}
                      disabled={!!actionLoading || !localStatus}
                      className="h-9 px-3 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium disabled:opacity-60 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Close */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={onClose}
                  disabled={!!actionLoading}
                  className="h-9 px-5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailsPanel;
