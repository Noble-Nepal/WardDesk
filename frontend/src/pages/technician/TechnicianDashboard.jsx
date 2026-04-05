import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  ClipboardList,
  Camera,
  Upload,
  ChevronRight,
  CheckCircle2,
  User,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ErrorAlert from "../../components/ui/ErrorAlert";
import SuccessToast from "../../components/ui/SuccessToast";
import TechnicianDashboardHeader from "../../components/technicianDashboard/TechnicianDashboardHeader";

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
  formatLongDate,
  formatShortDate,
  formatStatus,
} from "../../utils/technicianDashboardUtils";

const TechnicianDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(STATUS.ALL);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
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
            status: String(c.status || "assigned")
              .toLowerCase()
              .replace(/\s+/g, "_"),
            priority: String(c.priority || "low").toLowerCase(),
            address: c.address || "N/A",
            wardNumber: c.wardNumber ? `Ward ${c.wardNumber}` : "Ward -",
            submittedDate: c.submittedDate || new Date().toISOString(),
            citizenName: c.citizenName || "Unknown",
            complaintPhoto: rawPhoto,
            description: c.description || "No description provided.",
            workPhotos: Array.isArray(c.workPhotos) ? c.workPhotos : [],
            remarks: c.remarks || "",
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
    setSelectedComplaint((prev) =>
      prev && prev.id === id ? { ...prev, ...patch } : prev,
    );
  };

  const openStatusModal = (complaint) => {
    const next = getNextStatus(complaint.status);
    if (!next) return;
    setSelectedComplaint(complaint);
    setPendingStatus(next);
    setStatusRemarks("");
    setShowStatusModal(true);
    setError("");
  };

  const openUploadModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowUploadModal(true);
    setError("");
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowUploadModal(false);
    setIsLoading(false);
  };

  const onConfirmStatus = async () => {
    if (!selectedComplaint || !pendingStatus) return;

    setIsLoading(true);
    setError("");

    try {
      await updateComplaintStatus(selectedComplaint.complaintId, {
        status: pendingStatus,
        remarks: statusRemarks || "",
      });

      patchComplaint(selectedComplaint.id, {
        status: pendingStatus,
        remarks: statusRemarks || selectedComplaint.remarks,
      });

      closeModals();

      if (pendingStatus === "resolved") {
        toast.custom(
          <SuccessToast
            title="Complaint resolved"
            message={`Citizen notification sent to ${selectedComplaint.citizenName}`}
          />,
        );
      } else {
        toast.custom(
          <SuccessToast
            title="Status updated successfully"
            message={`Moved to ${formatStatus(pendingStatus)}`}
          />,
        );
      }
    } catch {
      setError("Failed to update complaint status.");
      setIsLoading(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedComplaint) return;

    setIsLoading(true);
    setError("");

    try {
      const photoUrl = await handleImageUpload(file);
      const photoType =
        selectedComplaint.status === "completed" ? "resolution" : "work_update";

      await uploadWorkPhoto(selectedComplaint.complaintId, {
        photoUrl,
        photoType,
      });

      patchComplaint(selectedComplaint.id, {
        workPhotos: [...(selectedComplaint.workPhotos || []), photoUrl],
      });

      closeModals();

      toast.custom(
        <SuccessToast
          title="Photo uploaded successfully"
          message={`${
            photoType === "resolution"
              ? "Resolution photo"
              : "Work update photo"
          } added`}
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
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${className}`}
      >
        {Icon ? <Icon className="w-3 h-3" /> : null}
        {label}
      </span>
    );
  };

  const renderActionBtn = (complaint, compact = false) => {
    const action = getActionMetaByCurrentStatus(complaint.status);
    if (!action) return null;

    const { label, className, Icon } = action;

    return (
      <Button
        size="sm"
        className={`${compact ? "h-7 px-2.5 text-xs" : "flex-1"} ${className}`}
        onClick={(e) => {
          if (e) e.stopPropagation();
          openStatusModal(complaint);
        }}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="ml-1.5">{label}</span>
      </Button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <TechnicianDashboardHeader />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-0.5 px-0.5">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {STATUS_LABELS[tab]} ({counts[tab] ?? 0})
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 text-sm"
                placeholder="Search by title or ID..."
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <ErrorAlert message={error} />

        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-sm text-gray-500">No assigned complaints</div>
            <div className="text-xs text-gray-400 mt-1">
              {searchQuery
                ? "Try adjusting your search"
                : "You have no complaints matching this filter"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div
              className={`${selectedComplaint ? "lg:w-1/2" : "w-full"} space-y-3`}
            >
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedComplaint?.id === c.id
                      ? "border-[#2B4AA0] ring-1 ring-[#2B4AA0] bg-blue-50/30"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-1 p-2.5 sm:p-4 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-gray-400" />
                          {c.complaintId}
                        </span>

                        <span
                          className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${getPriorityClass(c.priority)}`}
                        >
                          {c.priority}
                        </span>

                        {renderStatusBadge(c.status)}
                      </div>

                      <h3 className="text-sm text-gray-900 mb-1 truncate">
                        {c.title}
                      </h3>

                      <div className="flex items-center gap-x-3 text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-3 h-3" />
                          {c.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.wardNumber}
                        </span>
                      </div>

                      <div className="hidden sm:flex text-xs text-gray-500 items-center gap-1 mb-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-1.5 border-t border-gray-100">
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.citizenName}</span>
                        </span>
                        <span className="shrink-0 ml-2">
                          {formatShortDate(c.submittedDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 lg:hidden">
                        {renderActionBtn(c, true)}
                        {c.status !== "resolved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 sm:w-auto sm:px-2.5 border-gray-300 text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUploadModal(c);
                            }}
                          >
                            <Camera className="w-3.5 h-3.5 sm:mr-1" />
                            <span className="hidden sm:inline text-xs">
                              Photo
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 w-20 sm:w-32 h-28 sm:h-32 bg-gray-100 border-l border-gray-100">
                      {c.complaintPhoto ? (
                        <img
                          src={c.complaintPhoto}
                          alt={c.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedComplaint && (
              <div
                className="hidden lg:block lg:w-1/2 lg:sticky lg:top-24 lg:self-start"
                style={{ maxHeight: "calc(100vh - 12rem)" }}
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full max-h-[inherit] flex flex-col">
                  <div className="p-5 border-b border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Details of the selected complaint:
                    </p>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 text-xs text-gray-500">
                          <Hash className="w-3.5 h-3.5 text-gray-400" />
                          {selectedComplaint.complaintId}
                        </div>
                        <h2 className="text-lg text-gray-900">
                          {selectedComplaint.title}
                        </h2>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={() => setSelectedComplaint(null)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs ${getPriorityClass(
                          selectedComplaint.priority,
                        )}`}
                      >
                        {selectedComplaint.priority}
                      </span>
                      {renderStatusBadge(selectedComplaint.status)}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div>
                      <h3 className="text-sm text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedComplaint.description}
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
                              {selectedComplaint.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Ward</p>
                            <p className="text-sm text-gray-900">
                              {selectedComplaint.wardNumber}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">
                              {selectedComplaint.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Citizen</p>
                            <p className="text-sm text-gray-900">
                              {selectedComplaint.citizenName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-[#2B4AA0] mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Submitted</p>
                            <p className="text-sm text-gray-900">
                              {formatLongDate(selectedComplaint.submittedDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedComplaint.remarks ? (
                      <div>
                        <h3 className="text-sm text-gray-900 mb-2">
                          Work Remarks
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                          {selectedComplaint.remarks}
                        </div>
                      </div>
                    ) : null}

                    {selectedComplaint.workPhotos?.length ? (
                      <div>
                        <h3 className="text-sm text-gray-900 mb-2">
                          Work Photos ({selectedComplaint.workPhotos.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedComplaint.workPhotos.map((p, i) => (
                            <div
                              key={i}
                              className="rounded-lg overflow-hidden border border-gray-200"
                            >
                              <img
                                src={p}
                                className="w-full h-28 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center gap-2">
                    {getNextStatus(selectedComplaint.status) ? (
                      <>
                        {renderActionBtn(selectedComplaint)}
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-600"
                          onClick={() => openUploadModal(selectedComplaint)}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 text-center py-2">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          This complaint has been resolved
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showStatusModal && selectedComplaint && pendingStatus && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-gray-900">Update Status</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedComplaint.complaintId} - {selectedComplaint.title}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-3">
                  {renderStatusBadge(selectedComplaint.status)}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {renderStatusBadge(pendingStatus)}
                </div>
              </div>

              {pendingStatus === "resolved" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
                  Marking as resolved will notify the citizen via email
                  automatically.
                </div>
              )}

              <div>
                <label className="text-sm text-gray-700 mb-1.5 block">
                  Remarks (optional)
                </label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent"
                  placeholder="Add any notes about the work done..."
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-5 bg-gray-50 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                className="border-gray-300"
                disabled={isLoading}
                onClick={closeModals}
              >
                Cancel
              </Button>
              <Button
                className={
                  getActionMetaByCurrentStatus(selectedComplaint.status)
                    ?.className || "bg-[#2B4AA0] text-white"
                }
                disabled={isLoading}
                onClick={onConfirmStatus}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="ml-2">Confirm</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && selectedComplaint && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-gray-900">Upload Work Photo</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedComplaint.complaintId} - {selectedComplaint.title}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2B4AA0]" />
                <span className="text-xs text-[#2B4AA0]">
                  Photo type:{" "}
                  {selectedComplaint.status === "completed"
                    ? "Resolution Photo"
                    : "Work Update Photo"}
                </span>
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2B4AA0] hover:bg-blue-50/30 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />

              {selectedComplaint.workPhotos?.length ? (
                <div>
                  <span className="text-xs text-gray-500 mb-2 block">
                    Previously uploaded ({selectedComplaint.workPhotos.length})
                  </span>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedComplaint.workPhotos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-gray-200 p-5 bg-gray-50 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                className="border-gray-300"
                disabled={isLoading}
                onClick={closeModals}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#2B4AA0] hover:bg-[#1d3570] text-white"
                disabled={isLoading}
                onClick={() => fileRef.current?.click()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
