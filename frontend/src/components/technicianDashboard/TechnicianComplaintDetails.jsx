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
  ClipboardList,
  Clock,
  CheckCircle,
  CheckCircle2,
  Camera,
  MapPin,
} from "lucide-react";
import QRCodeSection from "../complaint/complaintDetails/QRCodeSection";
import NepalMapPicker from "../map/mapPicker";
import {
  getStatusBadgeMeta,
  getPriorityClass,
  getActionMetaByCurrentStatus,
  getNextStatus,
  formatLongDate,
} from "../../utils/technicianDashboardUtils";

const ANIM_MS = 220;

const timelineSteps = [
  { label: "Assigned", Icon: ClipboardList },
  { label: "In Progress", Icon: Clock },
  { label: "Completed", Icon: CheckCircle },
  { label: "Resolved", Icon: CheckCircle2 },
];

const getStep = (status) => {
  if (status === "resolved") return 4;
  if (status === "completed") return 3;
  if (status === "in_progress") return 2;
  return 1;
};

const getCategoryBadgeClass = (category = "") => {
  const c = String(category).toLowerCase();
  if (c.includes("road")) return "bg-yellow-100 text-yellow-700";
  if (c.includes("water")) return "bg-blue-100 text-blue-700";
  if (c.includes("electric")) return "bg-orange-100 text-orange-700";
  if (c.includes("sanit")) return "bg-green-100 text-green-700";
  if (c.includes("safety")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
};

const DetailRow = ({ icon, label, children }) => (
  <div className="flex gap-2.5 p-2.5 bg-gray-50 rounded-lg">
    <div className="w-4 h-4 text-gray-400 shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {children}
    </div>
  </div>
);

export default function TechnicianComplaintDetails({
  open,
  complaint,
  onClose,
  onUpdateStatus,
  onUploadPhoto,
}) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  const triggerClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), ANIM_MS);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && triggerClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, triggerClose]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) =>
      ref.current && !ref.current.contains(e.target) && triggerClose();
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, triggerClose]);

  if (!open || !complaint) return null;

  const step = getStep(complaint.status);
  const { className: statusClass, Icon: StatusIcon, label: statusLabel } =
    getStatusBadgeMeta(complaint.status);
  const actionMeta = getActionMetaByCurrentStatus(complaint.status);
  const hasNext = !!getNextStatus(complaint.status);
  const lat = Number(complaint.latitude);
  const lng = Number(complaint.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const coords = hasCoords ? [lat, lng] : null;

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
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${statusClass}`}>
                {StatusIcon && <StatusIcon className="w-3 h-3" />}
                {statusLabel}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityClass(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug wrap-break-word">
              {complaint.title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">#{complaint.complaintId}</p>
          </div>
          <button
            onClick={triggerClose}
            className="shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5"
          >
            <MdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Left — QR + Map */}
            <div className="flex flex-col gap-4">
              <QRCodeSection
                trackingId={complaint.complaintId}
                issueTitle={complaint.title}
                category={complaint.category}
                location={complaint.address}
                status={complaint.status}
                qrId={`tech-complaint-qr-${complaint.id}`}
                downloadFileName={`complaint-${complaint.complaintId}-qr.png`}
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
                    <p className="text-xs text-gray-500">{complaint.address || "Location unavailable"}</p>
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
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(complaint.category)}`}>
                        {complaint.category || "—"}
                      </span>
                    </DetailRow>
                    <DetailRow icon={<MdFlag className="w-4 h-4" />} label="Priority">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityClass(complaint.priority)}`}>
                        {complaint.priority || "low"}
                      </span>
                    </DetailRow>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <DetailRow icon={<MdLocationOn className="w-4 h-4" />} label="Address">
                      <p className="text-xs text-gray-900 wrap-break-word">{complaint.address || "—"}</p>
                    </DetailRow>
                    <DetailRow icon={<MdRoom className="w-4 h-4" />} label="Ward">
                      <p className="text-xs text-gray-900">{complaint.wardNumber || "—"}</p>
                    </DetailRow>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <DetailRow icon={<MdPerson className="w-4 h-4" />} label="Citizen">
                      <p className="text-xs text-gray-900 truncate">{complaint.citizenName || "—"}</p>
                    </DetailRow>
                    <DetailRow icon={<MdCalendarToday className="w-4 h-4" />} label="Submitted">
                      <p className="text-xs text-gray-900">{formatLongDate(complaint.submittedDate)}</p>
                    </DetailRow>
                  </div>
                </div>
              </div>

              {/* Horizontal Timeline */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Progress Timeline</p>
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

              {/* Work Remarks */}
              {complaint.remarks && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Work Remarks</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-gray-700">
                    {complaint.remarks}
                  </div>
                </div>
              )}

              {/* Photos — Complaint / Work side by side */}
              {(complaint.complaintPhoto || complaint.workPhotos?.length > 0) && (
                <div className={`grid gap-3 ${complaint.complaintPhoto && complaint.workPhotos?.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {complaint.complaintPhoto && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-500">
                        <MdImage className="w-3.5 h-3.5" />
                        Complaint Photo
                      </p>
                      <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                        <img src={complaint.complaintPhoto} alt={complaint.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {complaint.workPhotos?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-500">
                        <Camera className="w-3.5 h-3.5" />
                        Work Photos ({complaint.workPhotos.length})
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {complaint.workPhotos.map((url, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 aspect-square">
                            <img src={url} alt={`Work photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-5 sm:px-6 py-4 rounded-b-2xl">
          {hasNext ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <button
                onClick={() => { onUploadPhoto(complaint); triggerClose(); }}
                className="h-10 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Upload Work Photo
              </button>
              <button
                onClick={() => { onUpdateStatus(complaint); triggerClose(); }}
                className={`h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition-opacity ${actionMeta?.className || "bg-[#2B4AA0] text-white"}`}
              >
                {actionMeta?.Icon && <actionMeta.Icon className="w-4 h-4" />}
                {actionMeta?.label || "Update Status"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1 text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              This complaint has been resolved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
