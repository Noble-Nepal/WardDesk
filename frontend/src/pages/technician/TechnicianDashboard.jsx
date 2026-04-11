import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
  ClipboardList,
  Camera,
  Upload,
  Loader2,
  MapPin,
  User,
  X,
} from "lucide-react";

import ErrorAlert from "../../components/ui/ErrorAlert";
import SuccessToast from "../../components/ui/SuccessToast";
import TechnicianDashboardHeader from "../../components/technicianDashboard/TechnicianDashboardHeader";
import TechnicianComplaintDetails from "../../components/technicianDashboard/TechnicianComplaintDetails";

import {
  getAssignedComplaints,
  updateComplaintStatus,
  uploadWorkPhoto,
} from "../../api/technicianDashboardApi";
import handleImageUpload from "../../utils/handleImageUpload";

import {
  STATUS,
  STATUS_TABS,
  STATUS_LABELS,
} from "../../constants/technicianDashboardConstants";

import {
  filterComplaints,
  getCounts,
  getNextStatus,
  getStatusBadgeMeta,
  getPriorityClass,
  getActionMetaByCurrentStatus,
  formatShortDate,
  formatStatus,
} from "../../utils/technicianDashboardUtils";


const TechnicianDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(STATUS.ALL);
  const [detailComplaint, setDetailComplaint] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [actionComplaint, setActionComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAssignedComplaints();
        const mapped = (data || []).map((c, idx) => {
          const rawPhoto =
            c.complaintPhoto ||
            c.photoUrl ||
            c.imageUrl ||
            (Array.isArray(c.photoUrls) ? c.photoUrls[0] : "") ||
            "";
          return {
            id: c.complaintId || `temp-${idx}`,
            complaintId: c.complaintId || "N/A",
            title: c.title || "Untitled",
            category: c.category || "N/A",
            status: String(c.status || "assigned").toLowerCase().replace(/\s+/g, "_"),
            priority: String(c.priority || "low").toLowerCase(),
            address: c.address || "N/A",
            wardNumber: c.wardNumber ? `Ward ${c.wardNumber}` : "Ward -",
            submittedDate: c.submittedDate || new Date().toISOString(),
            citizenName: c.citizenName || "Unknown",
            complaintPhoto: rawPhoto,
            description: c.description || "No description provided.",
            workPhotos: Array.isArray(c.workPhotos) ? c.workPhotos : [],
            remarks: c.remarks || "",
            latitude: c.latitude,
            longitude: c.longitude,
          };
        });
        setComplaints(mapped);
      } catch {
        setError("Failed to load assigned complaints.");
      }
    })();
  }, []);

  const counts = useMemo(() => getCounts(complaints), [complaints]);
  const filteredComplaints = useMemo(
    () => filterComplaints(complaints, activeTab, searchQuery),
    [complaints, activeTab, searchQuery],
  );

  const patchComplaint = (id, patch) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
    setDetailComplaint((prev) =>
      prev && prev.id === id ? { ...prev, ...patch } : prev,
    );
  };

  const openStatusModal = (complaint) => {
    const next = getNextStatus(complaint.status);
    if (!next) return;

    // Require at least one work photo before resolving
    if (next === "resolved" && (!complaint.workPhotos || complaint.workPhotos.length === 0)) {
      setError("Please upload a resolution photo before marking this complaint as resolved.");
      return;
    }

    setError("");
    setActionComplaint(complaint);
    setPendingStatus(next);
    setStatusRemarks("");
    setShowStatusModal(true);
  };

  const openUploadModal = (complaint) => {
    setActionComplaint(complaint);
    setShowUploadModal(true);
    setError("");
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowUploadModal(false);
    setIsLoading(false);
  };

  const onConfirmStatus = async () => {
    if (!actionComplaint || !pendingStatus) return;
    setIsLoading(true);
    setError("");
    try {
      await updateComplaintStatus(actionComplaint.complaintId, {
        status: pendingStatus,
        remarks: statusRemarks || "",
      });
      patchComplaint(actionComplaint.id, {
        status: pendingStatus,
        remarks: statusRemarks || actionComplaint.remarks,
      });
      closeModals();
      toast.custom(
        <SuccessToast
          title={pendingStatus === "resolved" ? "Complaint resolved" : "Status updated"}
          message={
            pendingStatus === "resolved"
              ? `Citizen notification sent to ${actionComplaint.citizenName}`
              : `Moved to ${formatStatus(pendingStatus)}`
          }
        />,
      );
    } catch {
      setError("Failed to update complaint status.");
      setIsLoading(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !actionComplaint) return;
    setIsLoading(true);
    setError("");
    try {
      const photoUrl = await handleImageUpload(file);
      const photoType =
        actionComplaint.status === "completed" ? "resolution" : "work_update";
      await uploadWorkPhoto(actionComplaint.complaintId, { photoUrl, photoType });
      patchComplaint(actionComplaint.id, {
        workPhotos: [...(actionComplaint.workPhotos || []), photoUrl],
      });
      closeModals();
      toast.custom(
        <SuccessToast
          title="Photo uploaded"
          message={`${photoType === "resolution" ? "Resolution photo" : "Work update photo"} added`}
        />,
      );
    } catch {
      setError("Failed to upload photo.");
      setIsLoading(false);
    } finally {
      e.target.value = "";
    }
  };

  const renderStatusBadge = (status) => {
    const { className, Icon, label } = getStatusBadgeMeta(status);
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${className}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <TechnicianDashboardHeader />

      {/* Tabs + Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#2B4AA0] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {STATUS_LABELS[tab]}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  {counts[tab] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-9 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent"
              placeholder="Search title or ID…"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <ErrorAlert message={error} />

        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 flex flex-col items-center">
            <ClipboardList className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">No complaints found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery ? "Try adjusting your search" : "No complaints match this filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((c) => {
              const actionMeta = getActionMetaByCurrentStatus(c.status);
              return (
                <div
                  key={c.id}
                  onClick={() => setDetailComplaint(c)}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex gap-0">
                    {/* Content */}
                    <div className="flex-1 min-w-0 p-4 sm:p-5">
                      {/* Top row: badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        {renderStatusBadge(c.status)}
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityClass(c.priority)}`}>
                          {c.priority}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto shrink-0">
                          #{c.complaintId}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 truncate">
                        {c.title}
                      </h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                          {c.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {c.wardNumber}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate max-w-40">{c.address}</span>
                        </span>
                      </div>

                      {/* Footer row: citizen + date + actions */}
                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-400 min-w-0">
                          <span className="flex items-center gap-1 truncate">
                            <User className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{c.citizenName}</span>
                          </span>
                          <span className="shrink-0">{formatShortDate(c.submittedDate)}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openUploadModal(c)}
                            className="h-8 px-3 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Photo</span>
                          </button>
                          {actionMeta && (
                            <button
                              onClick={() => openStatusModal(c)}
                              className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${actionMeta.className}`}
                            >
                              <actionMeta.Icon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{actionMeta.label}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Photo thumbnail */}
                    <div className="shrink-0 w-24 sm:w-32 bg-gray-100 rounded-r-xl overflow-hidden">
                      {c.complaintPhoto ? (
                        <img
                          src={c.complaintPhoto}
                          alt={c.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Complaint Details Modal */}
      <TechnicianComplaintDetails
        open={!!detailComplaint}
        complaint={detailComplaint}
        onClose={() => setDetailComplaint(null)}
        onUpdateStatus={(c) => openStatusModal(c)}
        onUploadPhoto={(c) => openUploadModal(c)}
      />

      {/* Update Status Modal */}
      {showStatusModal && actionComplaint && pendingStatus && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-200 px-5 py-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Update Status</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                  {actionComplaint.complaintId} · {actionComplaint.title}
                </p>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center gap-3">
                {renderStatusBadge(actionComplaint.status)}
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {renderStatusBadge(pendingStatus)}
              </div>

              {pendingStatus === "resolved" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700">
                  Marking as resolved will notify the citizen via email automatically.
                </div>
              )}

              <div>
                <label className="text-sm text-gray-700 mb-1.5 block font-medium">
                  Remarks <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent"
                  placeholder="Add any notes about the work done…"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-2">
              <button
                disabled={isLoading}
                onClick={closeModals}
                className="h-10 px-5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={onConfirmStatus}
                className={`h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60 transition-opacity ${
                  getActionMetaByCurrentStatus(actionComplaint.status)?.className || "bg-[#2B4AA0] text-white"
                }`}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Confirm</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && actionComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-200 px-5 py-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Upload Work Photo</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                  {actionComplaint.complaintId} · {actionComplaint.title}
                </p>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2B4AA0] shrink-0" />
                <span className="text-xs text-[#2B4AA0]">
                  Photo type:{" "}
                  <span className="font-medium">
                    {actionComplaint.status === "completed" ? "Resolution Photo" : "Work Update Photo"}
                  </span>
                </span>
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#2B4AA0] hover:bg-blue-50/30 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

              {actionComplaint.workPhotos?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Previously uploaded ({actionComplaint.workPhotos.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {actionComplaint.workPhotos.map((p, i) => (
                      <img key={i} src={p} className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-2">
              <button
                disabled={isLoading}
                onClick={closeModals}
                className="h-10 px-5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={() => fileRef.current?.click()}
                className="h-10 px-5 rounded-lg bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60 transition-colors"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
