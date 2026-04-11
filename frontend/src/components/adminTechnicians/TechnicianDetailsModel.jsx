import { useCallback, useEffect, useRef, useState } from "react";
import {
  XCircle,
  UserCheck,
  UserX,
  ShieldX,
  Hash,
  Phone,
  MapPin,
  Calendar,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
  ACCOUNT_STATUS_META,
  VERIFICATION_META,
  ASSIGNMENT_META,
} from "../../constants/adminTechnicianConstants";

const fmtDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const initials = (n = "") =>
  n
    .split(" ")
    .map((w) => w?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "T";

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2B4AA0] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-gray-900">{value || "-"}</div>
      </div>
    </div>
  );
}

const CLOSE_DELAY = 1800; // ms to show success before auto-close
const ANIM_DURATION = 220; // ms for fade/scale animation

export default function TechnicianDetailsModal({
  open,
  technician,
  onClose,
  onApprove,
  onReject,
  onUnverify,
  onUpdateAccountStatus,
}) {
  const ref = useRef();
  const closeTimerRef = useRef(null);

  const [submitting, setSubmitting] = useState(null); // "approve"|"reject"|"unverify"|"status"|null
  const [successMsg, setSuccessMsg] = useState(null); // { title, message } | null
  const [errorMsg, setErrorMsg] = useState("");
  const [statusValue, setStatusValue] = useState("active");
  const [visible, setVisible] = useState(false); // drives enter/leave animation

  // Animate in when opened
  useEffect(() => {
    if (open) {
      setVisible(false);
      // tiny delay so the initial class renders before transition kicks in
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reset state when modal opens with a new technician
  useEffect(() => {
    if (!open || !technician) return;
    setSubmitting(null);
    setSuccessMsg(null);
    setErrorMsg("");
    setStatusValue(technician?.isActive ? "active" : "inactive");
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open, technician]);

  // Smooth close: animate out then call onClose
  const triggerClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setVisible(false);
    setTimeout(() => onClose?.(), ANIM_DURATION);
  }, [onClose]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape" && !submitting) triggerClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, submitting, triggerClose]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !submitting) {
        triggerClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, submitting, triggerClose]);

  if (!open || !technician) return null;

  const canReview = technician.verificationStatus === "unverified";
  const isVerified = technician.verificationStatus === "verified";
  const statusChanged =
    (technician?.isActive ? "active" : "inactive") !== statusValue;

  // After a successful action: show success, then auto-close
  const onSuccess = (title, message) => {
    setSuccessMsg({ title, message });
    setErrorMsg("");
    closeTimerRef.current = setTimeout(() => triggerClose(), CLOSE_DELAY);
  };

  const handleApproveClick = async () => {
    if (!onApprove || submitting) return;
    setErrorMsg("");
    setSubmitting("approve");
    try {
      await onApprove(technician);
      onSuccess(
        "Technician Approved",
        `${technician.fullName} has been verified. A confirmation email has been sent to ${technician.email}.`,
      );
    } catch {
      setErrorMsg("Failed to approve technician. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleRejectClick = async () => {
    if (!onReject || submitting) return;
    setErrorMsg("");
    setSubmitting("reject");
    try {
      await onReject(technician);
      onSuccess(
        "Application Rejected",
        `${technician.fullName}'s application has been rejected. A notification email has been sent to ${technician.email}.`,
      );
    } catch {
      setErrorMsg("Failed to reject technician. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleUnverifyClick = async () => {
    if (!onUnverify || submitting) return;
    setErrorMsg("");
    setSubmitting("unverify");
    try {
      await onUnverify(technician);
      onSuccess(
        "Technician Unverified",
        `${technician.fullName} has been unverified and their account deactivated.`,
      );
    } catch {
      setErrorMsg("Failed to unverify technician. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleUpdateStatus = async () => {
    if (!onUpdateAccountStatus || submitting || !statusChanged) return;
    const nextIsActive = statusValue === "active";
    setErrorMsg("");
    setSubmitting("status");
    try {
      await onUpdateAccountStatus(technician, nextIsActive);
      onSuccess(
        "Account Status Updated",
        `${technician.fullName}'s account has been marked as ${nextIsActive ? "Active" : "Inactive"}.`,
      );
    } catch {
      setErrorMsg("Failed to update account status. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const isLoading = !!submitting;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-[${ANIM_DURATION}ms] ${
        visible ? "bg-black/50" : "bg-black/0"
      }`}
      style={{ backdropFilter: visible ? "blur(2px)" : "none" }}
    >
      <div
        ref={ref}
        style={{ transitionDuration: `${ANIM_DURATION}ms` }}
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl flex flex-col transition-all ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 className="text-xl text-gray-900 font-semibold">
              Technician Details
            </h2>
            <p className="text-xs text-gray-500">
              Review and manage technician account
            </p>
          </div>
          <button
            onClick={triggerClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="h-20 bg-[#2B4AA0]" />

          <div className="px-6 pb-6 -mt-10">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-[#2B4AA0] font-semibold text-xl overflow-hidden">
              {technician.profilePhotoUrl ? (
                <img
                  src={technician.profilePhotoUrl}
                  alt={technician.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials(technician.fullName)
              )}
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {technician.fullName}
              </h3>
              <p className="text-sm text-gray-500">{technician.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge
                  meta={ACCOUNT_STATUS_META[technician.accountStatus]}
                />
                <StatusBadge
                  meta={VERIFICATION_META[technician.verificationStatus]}
                />
                <StatusBadge
                  meta={ASSIGNMENT_META[technician.assignmentStatus]}
                />
              </div>
            </div>

            {/* Personal Info */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Personal Information
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField icon={Hash} label="User ID" value={technician.userId} />
                <InfoField icon={Phone} label="Phone" value={technician.phoneNumber} />
                <InfoField
                  icon={MapPin}
                  label="Ward"
                  value={`Ward ${technician.wardNumber ?? "-"}`}
                />
                <InfoField icon={MapPin} label="Address" value={technician.address} />
                <InfoField
                  icon={Calendar}
                  label="Registration Date"
                  value={fmtDate(technician.createdAt)}
                />
                {technician.specialization && (
                  <InfoField
                    icon={Wrench}
                    label="Specialization"
                    value={technician.specialization}
                  />
                )}
              </div>
            </div>

            {/* Performance */}
            {(technician.completedTasks > 0 || technician.activeTasks > 0) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Performance
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg bg-white p-4 text-center">
                    <div className="text-xs text-gray-500">Completed Tasks</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {technician.completedTasks}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg bg-white p-4 text-center">
                    <div className="text-xs text-gray-500">Active Tasks</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {technician.activeTasks}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Citizenship doc */}
            {technician.citizenshipPhotoUrl && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Citizenship Document
                </h4>
                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                  <img
                    src={technician.citizenshipPhotoUrl}
                    alt="Citizenship"
                    className="w-full max-h-96 object-contain rounded"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Verify the authenticity of this document before approving.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3">

          {/* Success state */}
          {successMsg && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{successMsg.title}</p>
                <p className="text-xs text-green-700 mt-0.5">{successMsg.message}</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>
                {submitting === "approve" && "Approving and sending confirmation email…"}
                {submitting === "reject" && "Rejecting application and notifying technician…"}
                {submitting === "unverify" && "Unverifying and deactivating account…"}
                {submitting === "status" && "Updating account status…"}
              </span>
            </div>
          )}

          {/* Update Account Status row */}
          {!successMsg && (
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-700 font-medium shrink-0">
                Account Status
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  disabled={isLoading}
                  className="h-9 px-3 border border-gray-300 rounded-lg text-sm bg-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#2B4AA0]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isLoading || !statusChanged}
                  className="h-9 px-4 rounded-lg bg-[#2B4AA0] text-white text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2 transition-opacity"
                >
                  {submitting === "status" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Update
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!successMsg && (
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-1">
              <button
                onClick={triggerClose}
                disabled={isLoading}
                className="h-10 px-5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Close
              </button>

              {isVerified && (
                <button
                  onClick={handleUnverifyClick}
                  disabled={isLoading}
                  className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 inline-flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                >
                  {submitting === "unverify" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldX className="w-4 h-4" />
                  )}
                  Unverify Technician
                </button>
              )}

              {canReview && (
                <>
                  <button
                    onClick={handleRejectClick}
                    disabled={isLoading}
                    className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 inline-flex items-center justify-center gap-2 disabled:opacity-60 transition-colors min-w-40"
                  >
                    {submitting === "reject" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                    {submitting === "reject" ? "Rejecting…" : "Reject"}
                  </button>

                  <button
                    onClick={handleApproveClick}
                    disabled={isLoading}
                    className="h-10 px-4 rounded-lg bg-[#2B4AA0] text-white text-sm font-medium hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity min-w-40"
                  >
                    {submitting === "approve" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    {submitting === "approve" ? "Approving…" : "Approve"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
