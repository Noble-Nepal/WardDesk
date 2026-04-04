import { useMemo, useState } from "react";
import {
  ClipboardList,
  MapPin,
  Phone,
  Hash,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import SuccessToast from "../ui/SuccessToast";
import ErrorAlert from "../ui/ErrorAlert";
import StatusBadge from "./StatusBadge";
import { ACCOUNT_STATUS_META } from "../../constants/adminTechnicianConstants";

const formatDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getPriorityCls = (p) => {
  const k = String(p || "").toLowerCase();
  if (k === "high" || k === "urgent") return "bg-red-100 text-red-700";
  if (k === "medium") return "bg-orange-100 text-orange-700";
  return "bg-blue-100 text-blue-700";
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

const normalizeVerification = (v) => {
  const key = String(v || "").toLowerCase();
  if (key === "verified") return "verified";
  if (key === "rejected") return "rejected";
  return "unverified";
};

function VerificationBadge({ status }) {
  const key = normalizeVerification(status);

  if (key === "verified") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" /> Verified
      </span>
    );
  }

  if (key === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-orange-100 text-orange-700 border border-orange-200">
      <Clock className="w-3 h-3" /> Unverified
    </span>
  );
}

export default function AssignComplaintSection({
  open,
  onClose,
  technicians = [],
  complaints = [],
  onAssign, // async (complaint, technician)
}) {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submittingTechId, setSubmittingTechId] = useState(null);
  const [banner, setBanner] = useState(null);

  const availableTechs = useMemo(() => {
    if (!selectedComplaint) return [];
    return technicians.filter((t) => {
      const st = String(t.accountStatus || "").toLowerCase();
      return st === "active" || st === "verified";
    });
  }, [technicians, selectedComplaint]);

  if (!open) return null;

  const handleAssignClick = async (tech) => {
    if (!selectedComplaint || !onAssign || submittingTechId) return;

    setBanner(null);
    setSubmittingTechId(tech.userId);

    try {
      await onAssign(selectedComplaint, tech);
      setBanner({
        type: "success",
        title: "Complaint Assigned",
        message: `Complaint ${selectedComplaint.complaintId} assigned to ${tech.fullName}. Assignment email sent to ${tech.email} in their Gmail.`,
      });
      setSelectedComplaint(null);
      setTimeout(() => onClose?.(), 900);
    } catch {
      setBanner({
        type: "error",
        message: "Failed to assign complaint. Please try again.",
      });
    } finally {
      setSubmittingTechId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-900">
              Assign Complaint to Technician
            </h2>
            <p className="text-xs text-gray-600">
              Select complaint and assign to an available technician
            </p>
          </div>
          <button
            onClick={() => {
              if (submittingTechId) return;
              setSelectedComplaint(null);
              setBanner(null);
              onClose?.();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4">
          {submittingTechId && (
            <div className="mb-3 flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Assigning complaint and sending email notification...
            </div>
          )}
          {banner?.type === "success" && (
            <div className="mb-3">
              <SuccessToast title={banner.title} message={banner.message} />
            </div>
          )}
          {banner?.type === "error" && <ErrorAlert message={banner.message} />}
        </div>

        <div className="px-6 pb-6 flex-1 min-h-0">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left */}
            <div className="border border-gray-200 rounded-xl flex flex-col min-h-0">
              <div className="shrink-0 px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm text-[#2B4AA0] font-medium">
                  Unassigned Complaints
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {complaints.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {complaints.length ? (
                  complaints.map((c) => {
                    const selected =
                      selectedComplaint?.complaintId === c.complaintId;

                    return (
                      <button
                        key={c.complaintId}
                        onClick={() => setSelectedComplaint(c)}
                        className={`w-full text-left border rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selected
                            ? "border-[#2B4AA0] bg-blue-50 ring-1 ring-[#2B4AA0]"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex">
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Complaint ID:
                              </span>
                              <span className="text-xs text-gray-900">
                                {c.complaintId}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs ${getPriorityCls(c.priority)}`}
                              >
                                {String(c.priority || "low")}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-200">
                                <Clock className="w-2.5 h-2.5" />
                                {String(c.status || "pending")}
                              </span>
                              <VerificationBadge
                                status={c.verificationStatus}
                              />
                            </div>

                            <div className="text-sm text-gray-900 mb-1.5 truncate">
                              {c.title || c.category || "Untitled complaint"}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-1">
                              <span className="inline-flex items-center gap-1">
                                <ClipboardList className="w-3 h-3" />
                                {c.category || "-"}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Ward {c.wardNumber ?? "-"}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 flex items-center gap-1 mb-1.5 truncate">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {c.address || "-"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 pt-1.5 border-t border-gray-100">
                              <span>By {c.citizenName || "Unknown"}</span>
                              <span>{formatDate(c.submittedDate)}</span>
                            </div>
                          </div>

                          {c.photo && (
                            <div className="shrink-0 w-28">
                              <img
                                src={c.photo}
                                alt={c.title || "Complaint"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-sm text-gray-500">
                    <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    No unassigned complaints
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="border border-gray-200 rounded-xl flex flex-col min-h-0">
              <div className="shrink-0 px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm text-[#2B4AA0] font-medium">
                  Available Technicians
                </div>
                {selectedComplaint && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    Ward {selectedComplaint.wardNumber}
                  </span>
                )}
              </div>

              {!selectedComplaint ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-2">
                      <ClipboardList className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-500">
                      Select a complaint first
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Choose a complaint from the left to see matching
                      technicians
                    </div>
                  </div>
                </div>
              ) : availableTechs.length ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {availableTechs.map((t) => {
                    const busy = t.assignmentStatus === "busy";
                    const isAssigning = submittingTechId === t.userId;

                    return (
                      <div
                        key={t.userId}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0">
                            {t.profilePhotoUrl ? (
                              <img
                                src={t.profilePhotoUrl}
                                alt={t.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#2B4AA0] text-sm border border-blue-200">
                                {initials(t.fullName)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <div className="text-sm text-gray-900">
                                {t.fullName}
                              </div>
                              <VerificationBadge
                                status={t.verificationStatus}
                              />
                              {busy && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-200">
                                  <XCircle className="w-2.5 h-2.5" />
                                  Unavailable
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                User ID:
                              </span>
                              <span className="text-xs text-gray-900">
                                {t.userId}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                              <div className="inline-flex items-center gap-1 min-w-0">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  Ward {t.wardNumber ?? "-"}
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1 min-w-0">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {t.phoneNumber || "-"}
                                </span>
                              </div>
                              <div className="col-span-2 inline-flex items-center gap-1 min-w-0">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {t.address || "-"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <StatusBadge
                                meta={
                                  ACCOUNT_STATUS_META[
                                    String(t.accountStatus || "").toLowerCase()
                                  ] || ACCOUNT_STATUS_META.inactive
                                }
                              />
                              {typeof t.completedTasks !== "undefined" && (
                                <span className="text-xs text-gray-500">
                                  {Number(t.completedTasks || 0)} done /{" "}
                                  {Number(t.activeTasks || 0)} active
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            <button
                              disabled={busy || !!submittingTechId}
                              onClick={() => handleAssignClick(t)}
                              className={`px-4 h-8 rounded-lg text-sm text-white inline-flex items-center ${
                                busy || !!submittingTechId
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-[#2B4AA0] hover:bg-[#1d3570]"
                              }`}
                            >
                              {isAssigning ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                  Assigning
                                </>
                              ) : (
                                "Assign"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">
                      No available technicians
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Try selecting a different complaint
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {selectedComplaint ? (
              <>
                Selected:{" "}
                <span className="text-gray-900">
                  {selectedComplaint.complaintId}
                </span>
                {" - "}
                {selectedComplaint.title || "-"}
              </>
            ) : (
              "No complaint selected"
            )}
          </div>
          <button
            onClick={() => {
              if (submittingTechId) return;
              setSelectedComplaint(null);
              setBanner(null);
              onClose?.();
            }}
            className="h-9 px-4 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
