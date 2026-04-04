import { useEffect, useRef, useState } from "react";
import {
  XCircle,
  UserCheck,
  UserX,
  Hash,
  Phone,
  MapPin,
  Calendar,
  Wrench,
  Loader2,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import SuccessToast from "../ui/SuccessToast";
import ErrorAlert from "../ui/ErrorAlert";
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

export default function TechnicianDetailsModal({
  open,
  technician,
  onClose,
  onApprove,
  onReject,
  onUpdateAccountStatus,
}) {
  const ref = useRef();
  const [submitting, setSubmitting] = useState(null); // "approve" | "reject" | "status" | null
  const [banner, setBanner] = useState(null); // { type: "success" | "error", title?, message }
  const [statusValue, setStatusValue] = useState("active");

  useEffect(() => {
    if (!open || !technician) return;
    setSubmitting(null);
    setBanner(null);
    setStatusValue(technician?.isActive ? "active" : "inactive");
  }, [open, technician]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && !submitting && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (!open) return;
    const click = (e) =>
      ref.current &&
      !ref.current.contains(e.target) &&
      !submitting &&
      onClose?.();
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [open, onClose, submitting]);

  if (!open || !technician) return null;

  const canReview = technician.verificationStatus === "unverified";

  const handleApproveClick = async () => {
    if (!onApprove || submitting) return;
    setBanner(null);
    setSubmitting("approve");

    try {
      await onApprove(technician);
      setBanner({
        type: "success",
        title: "Technician Approved",
        message: `Approval confirmation email has been sent to ${technician.email} in their Gmail.`,
      });
    } catch {
      setBanner({
        type: "error",
        message: "Failed to approve technician. Please try again.",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleRejectClick = async () => {
    if (!onReject || submitting) return;
    setBanner(null);
    setSubmitting("reject");

    try {
      await onReject(technician);
      setBanner({
        type: "success",
        title: "Technician Rejected",
        message: `Rejection email has been sent to ${technician.email} in their Gmail.`,
      });
    } catch {
      setBanner({
        type: "error",
        message: "Failed to reject technician. Please try again.",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleUpdateStatus = async () => {
    if (!onUpdateAccountStatus || submitting) return;

    const nextIsActive = statusValue === "active";
    if (Boolean(technician?.isActive) === nextIsActive) return;

    setBanner(null);
    setSubmitting("status");

    try {
      await onUpdateAccountStatus(technician, nextIsActive);
      setBanner({
        type: "success",
        title: "Account Status Updated",
        message: `Account marked as ${
          nextIsActive ? "Active" : "Inactive"
        }. Email notification sent to ${technician.email} in their Gmail.`,
      });
    } catch {
      setBanner({
        type: "error",
        message: "Failed to update account status. Please try again.",
      });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div
        ref={ref}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 className="text-xl text-gray-900 font-semibold">
              Technician Details
            </h2>
            <p className="text-xs text-gray-600">
              Review and manage technician account
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={!!submitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="h-20 bg-[#2B4AA0]" />

        <div className="px-6 pb-6 -mt-10">
          {submitting && (
            <div className="mb-4 flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {submitting === "approve" &&
                "Approving technician and sending approval email..."}
              {submitting === "reject" &&
                "Rejecting technician and sending rejection email..."}
              {submitting === "status" &&
                "Updating account status and sending email..."}
            </div>
          )}

          {banner?.type === "success" && (
            <div className="mb-4">
              <SuccessToast title={banner.title} message={banner.message} />
            </div>
          )}
          {banner?.type === "error" && <ErrorAlert message={banner.message} />}

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
            <p className="text-sm text-gray-600">{technician.email}</p>
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

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Personal Information
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField
                icon={Hash}
                label="User ID"
                value={technician.userId}
              />
              <InfoField
                icon={Phone}
                label="Phone"
                value={technician.phoneNumber}
              />
              <InfoField
                icon={MapPin}
                label="Ward"
                value={`Ward ${technician.wardNumber ?? "-"}`}
              />
              <InfoField
                icon={MapPin}
                label="Address"
                value={technician.address}
              />
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

          {(technician.completedTasks > 0 || technician.activeTasks > 0) && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Performance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <p className="text-xs text-gray-500 mt-2">
                  Please verify the authenticity of the citizenship document
                  before approval.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-sm text-gray-700 font-medium">
              Account Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                disabled={!!submitting}
                className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white disabled:opacity-60"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={
                  !!submitting ||
                  (technician?.isActive ? "active" : "inactive") === statusValue
                }
                className="h-10 px-4 rounded-lg bg-[#2B4AA0] text-white text-sm disabled:opacity-60 inline-flex items-center"
              >
                {submitting === "status" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Changes are saved immediately. This dialog will stay open until you
            close it.
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={onClose}
              disabled={!!submitting}
              className="h-10 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Close
            </button>

            {canReview && (
              <>
                <button
                  onClick={handleRejectClick}
                  disabled={!!submitting}
                  className="h-10 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 inline-flex items-center justify-center disabled:opacity-60 min-w-[180px]"
                >
                  {submitting === "reject" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4 mr-2" />
                      Reject Application
                    </>
                  )}
                </button>

                <button
                  onClick={handleApproveClick}
                  disabled={!!submitting}
                  className="h-10 px-4 rounded-lg bg-[#2B4AA0] text-white hover:opacity-95 inline-flex items-center justify-center disabled:opacity-60 min-w-[180px]"
                >
                  {submitting === "approve" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve Technician
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
