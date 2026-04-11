import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdClose,
  MdSubject,
  MdLabel,
  MdLocationOn,
  MdPerson,
  MdCalendarToday,
  MdFlag,
  MdRoom,
  MdImage,
} from "react-icons/md";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ShieldX,
  Loader2,
  XCircle,
} from "lucide-react";
import QRCodeSection from "../complaint/complaintDetails/QRCodeSection";
import NepalMapPicker from "../map/mapPicker";
import { STATUS_UPDATE_OPTIONS } from "../../constants/adminComplaintManagementConstants";
import { normalizeStatus } from "../../utils/adminComplaintManagementUtils";

// ─── helpers ─────────────────────────────────────────────────────────────────
const getCategoryBadgeClass = (category = "") => {
  const c = String(category).toLowerCase();
  if (c.includes("road")) return "bg-yellow-100 text-yellow-700";
  if (c.includes("water")) return "bg-blue-100 text-blue-700";
  if (c.includes("electric")) return "bg-orange-100 text-orange-700";
  if (c.includes("sanit")) return "bg-green-100 text-green-700";
  if (c.includes("safety")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
};

const getPriorityBadgeClass = (priority = "") => {
  const p = String(priority).toLowerCase();
  if (p.includes("urgent")) return "bg-red-100 text-red-700";
  if (p.includes("high")) return "bg-orange-100 text-orange-700";
  if (p.includes("medium")) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
};

const getStepFromStatus = (status = "") => {
  const s = String(status).toLowerCase();
  if (s.includes("resolved") || s.includes("closed")) return 4;
  if (s.includes("assigned") || s.includes("progress")) return 3;
  if (s.includes("review")) return 2;
  return 1;
};

const timelineSteps = [
  { label: "Reported", Icon: Clock },
  { label: "Under Review", Icon: AlertCircle },
  { label: "In Progress", Icon: AlertCircle },
  { label: "Resolved", Icon: CheckCircle2 },
];

const DetailRow = ({ icon, label, children }) => (
  <div className="flex gap-2.5 p-2.5 bg-gray-50 rounded-lg">
    <div className="w-4 h-4 text-gray-400 shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {children}
    </div>
  </div>
);

const CLOSE_DELAY = 3000;
const ANIM_MS = 220;

// ─── component ────────────────────────────────────────────────────────────────
const ComplaintDetailsPanel = ({
  open,
  complaint,
  categories,
  loading,
  onClose,
  onVerify,
  onUnverify,
  onUpdateCategory,
  onUpdateStatus,
}) => {
  const ref = useRef();
  const closeTimerRef = useRef(null);
  const transientTimerRef = useRef(null);

  const [submitting, setSubmitting] = useState(null); // "verify"|"unverify"|"category"|"status"|null
  const [successMsg, setSuccessMsg] = useState(null); // { title, message, autoClose }
  const [errorMsg, setErrorMsg] = useState("");
  const [localCategoryId, setLocalCategoryId] = useState("");
  const [localStatus, setLocalStatus] = useState("");
  const [visible, setVisible] = useState(false);

  // Animate in on open
  useEffect(() => {
    if (open) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Full reset only when switching to a different complaint (new modal open)
  useEffect(() => {
    setSubmitting(null);
    setSuccessMsg(null);
    setErrorMsg("");
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (transientTimerRef.current) clearTimeout(transientTimerRef.current);
    };
  }, [complaint?.complaintId]); // eslint-disable-line

  // Sync form selectors on every data refresh without clearing messages
  useEffect(() => {
    if (!complaint) return;
    setLocalCategoryId(complaint.categoryId ? String(complaint.categoryId) : "");
    setLocalStatus(normalizeStatus(complaint.statusName));
  }, [complaint]);

  // Smooth close
  const triggerClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setVisible(false);
    setTimeout(() => onClose?.(), ANIM_MS);
  }, [onClose]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && !submitting && triggerClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, submitting, triggerClose]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && !submitting && triggerClose();
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, submitting, triggerClose]);

  if (!open) return null;

  // ── action helpers ──
  // Decisive actions (verify/unverify) → show success then auto-close
  const runDecisive = async (key, apiFn, title, message) => {
    if (submitting) return;
    setErrorMsg("");
    setSuccessMsg(null);
    setSubmitting(key);
    try {
      await apiFn();
      setSuccessMsg({ title, message, autoClose: true });
      closeTimerRef.current = setTimeout(triggerClose, CLOSE_DELAY);
    } catch {
      setErrorMsg(`Failed to ${key === "verify" ? "verify" : "unverify"} complaint. Please try again.`);
    } finally {
      setSubmitting(null);
    }
  };

  // Edit actions (category/status) → show transient success, panel stays open
  const runEdit = async (key, apiFn, title, message) => {
    if (submitting) return;
    setErrorMsg("");
    if (transientTimerRef.current) clearTimeout(transientTimerRef.current);
    setSuccessMsg(null);
    setSubmitting(key);
    try {
      await apiFn();
      setSuccessMsg({ title, message, autoClose: false });
      transientTimerRef.current = setTimeout(() => setSuccessMsg(null), 3500);
    } catch {
      setErrorMsg(`Failed to update ${key}. Please try again.`);
    } finally {
      setSubmitting(null);
    }
  };

  const handleVerify = () =>
    runDecisive("verify", onVerify, "Complaint Verified",
      "This complaint has been marked as verified.");

  const handleUnverify = () =>
    runDecisive("unverify", onUnverify, "Complaint Unverified",
      "Verification has been removed from this complaint.");

  const handleUpdateCategory = () =>
    runEdit("category", () => onUpdateCategory(Number(localCategoryId)),
      "Category Updated", "Complaint category has been saved.");

  const handleUpdateStatus = () =>
    runEdit("status", () => onUpdateStatus(localStatus),
      "Status Updated", "Complaint status has been saved.");

  // ── derived ──
  const status = complaint?.statusName || "pending";
  const step = getStepFromStatus(status);
  const photos = complaint?.photoUrls || [];
  const showPhotos = photos.length > 0;
  const lat = Number(complaint?.latitude);
  const lng = Number(complaint?.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const coords = hasCoords ? [lat, lng] : null;
  const trackingId = complaint?.trackingId || "N/A";
  const isLoading = !!submitting;

  const categoryChanged =
    !!localCategoryId && localCategoryId !== String(complaint?.categoryId ?? "");
  const statusChanged =
    !!localStatus && localStatus !== normalizeStatus(complaint?.statusName);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "bg-black/50" : "bg-black/0"
      }`}
      style={{ backdropFilter: visible ? "blur(2px)" : "none" }}
    >
      <div
        ref={ref}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
        className={`bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col transition-all ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* ── Sticky Header ── */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">Complaint Details · Admin View</p>
            {loading ? (
              <div className="h-6 w-48 bg-gray-100 animate-pulse rounded" />
            ) : (
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug wrap-break-word">
                {complaint?.title || "Untitled Complaint"}
              </h2>
            )}
          </div>
          <button
            onClick={triggerClose}
            disabled={isLoading}
            className="shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5 disabled:opacity-40"
          >
            <MdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
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
          <div className="flex-1 overflow-y-auto min-h-0 px-5 sm:px-6 py-4 sm:py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Left — QR + Map */}
              <div className="flex flex-col gap-4">
                <QRCodeSection
                  trackingId={trackingId}
                  issueTitle={complaint.title}
                  category={complaint.categoryName}
                  location={complaint.locationAddress}
                  status={status}
                  qrId="admin-complaint-qr"
                  downloadFileName={`complaint-${trackingId}-qr.png`}
                  isSuccessVariant={false}
                />

                <div>
                  <p className="text-xs text-gray-500 mb-2">Location on Map</p>
                  {hasCoords ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ height: "160px" }}>
                      <NepalMapPicker value={coords} readOnly />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 h-32 flex flex-col items-center justify-center gap-1">
                      <MapPin className="w-7 h-7 text-red-400 opacity-40" />
                      <p className="text-xs text-gray-500">
                        {complaint.locationAddress || "Location unavailable"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right — Details + Timeline */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Issue Details</p>
                  <div className="space-y-2">
                    <DetailRow icon={<MdSubject className="w-4 h-4" />} label="Description">
                      <p className="text-sm text-gray-900 wrap-break-word line-clamp-3">
                        {complaint.description || "—"}
                      </p>
                    </DetailRow>

                    <div className="grid grid-cols-2 gap-2">
                      <DetailRow icon={<MdLabel className="w-4 h-4" />} label="Category">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(complaint.categoryName)}`}>
                          {complaint.categoryName || "—"}
                        </span>
                      </DetailRow>
                      <DetailRow icon={<MdFlag className="w-4 h-4" />} label="Priority">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityBadgeClass(complaint.priorityLevel)}`}>
                          {complaint.priorityLevel || "low"}
                        </span>
                      </DetailRow>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <DetailRow icon={<MdLocationOn className="w-4 h-4" />} label="Location">
                        <p className="text-xs text-gray-900 wrap-break-word">
                          {complaint.locationAddress || "—"}
                        </p>
                      </DetailRow>
                      <DetailRow icon={<MdRoom className="w-4 h-4" />} label="Ward">
                        <p className="text-xs text-gray-900">
                          {complaint.wardNumber ? `Ward ${complaint.wardNumber}` : "—"}
                        </p>
                      </DetailRow>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <DetailRow icon={<MdPerson className="w-4 h-4" />} label="Citizen">
                        <p className="text-xs text-gray-900 truncate">
                          {complaint.citizenName || "—"}
                        </p>
                      </DetailRow>
                      <DetailRow icon={<MdCalendarToday className="w-4 h-4" />} label="Submitted">
                        <p className="text-xs text-gray-900">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                              })
                            : "—"}
                        </p>
                      </DetailRow>
                    </div>
                  </div>
                </div>

                {/* Horizontal Timeline */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Status Timeline</p>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-start gap-1">
                      {timelineSteps.map((t, idx) => {
                        const completed = idx + 1 <= step;
                        const isLast = idx === timelineSteps.length - 1;
                        const Icon = t.Icon;
                        return (
                          <div key={t.label} className="flex-1 flex flex-col items-center gap-1 relative">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {!isLast && (
                              <div className={`absolute top-3.5 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-px ${completed && idx + 2 <= step ? "bg-green-300" : "bg-gray-200"}`} />
                            )}
                            <p className={`text-center text-[10px] leading-tight ${completed ? "text-gray-700" : "text-gray-400"}`}>
                              {t.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos — Before / After (permanent labels) */}
            {showPhotos && (() => {
              const beforePhotos = complaint.beforePhotos || photos;
              const afterPhotos = complaint.afterPhotos || complaint.workPhotoUrls || [];

              return (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-500">
                      <MdImage className="w-3.5 h-3.5" />
                      Before
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">Original</span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {beforePhotos.map((url, idx) => (
                        <div key={`before-${idx}`} className="rounded-lg overflow-hidden border border-gray-200 aspect-square">
                          <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {afterPhotos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-500">
                        <MdImage className="w-3.5 h-3.5" />
                        After
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px]">Resolved</span>
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {afterPhotos.map((url, idx) => (
                          <div key={`after-${idx}`} className="rounded-lg overflow-hidden border border-gray-200 aspect-square">
                            <img src={url} alt={`After photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Sticky Footer — Admin Controls ── */}
        {!loading && complaint && (
          <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-5 sm:px-6 py-4 space-y-3 rounded-b-2xl">

            {/* Loading bar */}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>
                  {submitting === "verify" && "Verifying complaint…"}
                  {submitting === "unverify" && "Removing verification…"}
                  {submitting === "category" && "Updating category…"}
                  {submitting === "status" && "Updating status…"}
                </span>
              </div>
            )}

            {/* Success banner */}
            {successMsg && (
              <div className={`flex items-start gap-3 rounded-lg px-4 py-3 border transition-all ${
                successMsg.autoClose
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}>
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{successMsg.title}</p>
                  <p className="text-xs mt-0.5 opacity-80">{successMsg.message}</p>
                  {successMsg.autoClose && (
                    <p className="text-xs mt-1 opacity-60">Closing automatically…</p>
                  )}
                </div>
                {!successMsg.autoClose && (
                  <button
                    onClick={() => setSuccessMsg(null)}
                    className="text-emerald-500 hover:text-emerald-700 shrink-0"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm flex-1">{errorMsg}</p>
                <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-red-600 shrink-0">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Controls — hide during auto-close success */}
            {!successMsg?.autoClose && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Verification */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Verification
                  </label>
                  {complaint.isVerified ? (
                    <button
                      onClick={handleUnverify}
                      disabled={isLoading}
                      className="w-full h-9 px-3 border border-red-300 text-red-700 rounded-lg bg-white hover:bg-red-50 text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      {submitting === "unverify"
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <ShieldX className="w-4 h-4" />}
                      Unverify
                    </button>
                  ) : (
                    <button
                      onClick={handleVerify}
                      disabled={isLoading}
                      className="w-full h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      {submitting === "verify"
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <ShieldCheck className="w-4 h-4" />}
                      Verify
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-9 px-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
                      value={localCategoryId}
                      onChange={(e) => setLocalCategoryId(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">Select…</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateCategory}
                      disabled={isLoading || !categoryChanged}
                      className="h-9 px-3 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      {submitting === "category"
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : "Save"}
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
                      className="flex-1 h-9 px-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] disabled:opacity-60"
                      value={localStatus}
                      onChange={(e) => setLocalStatus(e.target.value)}
                      disabled={isLoading}
                    >
                      {STATUS_UPDATE_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={isLoading || !statusChanged}
                      className="h-9 px-3 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      {submitting === "status"
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Close */}
            {!successMsg?.autoClose && (
              <div className="flex justify-end">
                <button
                  onClick={triggerClose}
                  disabled={isLoading}
                  className="h-9 px-6 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailsPanel;
