import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Clock, AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import QRCodeSection from "./QRCodeSection";
import NepalMapPicker from "../../map/mapPicker";

const getCategoryBadgeClass = (category = "") => {
  const c = String(category).toLowerCase();
  if (c.includes("road")) return "bg-yellow-100 text-yellow-700";
  if (c.includes("water")) return "bg-blue-100 text-blue-700";
  if (c.includes("electric")) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
};

const getPriorityBadgeClass = (priority = "") => {
  const p = String(priority).toLowerCase();
  if (p.includes("urgent")) return "bg-red-100 text-red-700";
  if (p.includes("high")) return "bg-orange-100 text-orange-700";
  if (p.includes("medium")) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
};

const getStepFromStatusMyComplaints = (status = "") => {
  const s = String(status).toLowerCase();
  if (s.includes("resolved")) return 4;
  if (s.includes("assigned") || s.includes("progress") || s.includes("work"))
    return 3;
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

const ComplaintDetails = ({ isOpen, onClose, issueData, variant }) => {
  const navigate = useNavigate();

  const isSuccessModal = variant === "success";
  const isTrackedVariant = variant === "tracked";
  const safeIssue = issueData || {};

  const trackingId = safeIssue.id || safeIssue.trackingId || "N/A";
  const status = safeIssue.status || safeIssue.statusName || "submitted";
  const step = useMemo(() => getStepFromStatusMyComplaints(status), [status]);

  const photos = safeIssue.photos || safeIssue.photoUrls || [];
  const showPhotos = Array.isArray(photos) && photos.length > 0;

  const lat = Number(safeIssue.latitude);
  const lng = Number(safeIssue.longitude);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const coords = hasCoordinates ? [lat, lng] : null;

  const qrId = isSuccessModal
    ? "qr-code-svg"
    : isTrackedVariant
      ? "tracked-qr-code"
      : "issue-qr-code";

  if (!isOpen || !issueData) return null;

  const handlePrimary = () => {
    if (isSuccessModal) {
      onClose();
      navigate("/citizen/my-complaints");
      return;
    }
    onClose();
  };

  const handleSecondary = () => onClose();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">

        {/* ── Sticky Header ── */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">Complaint Details</p>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug wrap-break-word">
              {safeIssue.title}
            </h2>
          </div>
          <button
            onClick={onClose}
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
                trackingId={trackingId}
                issueTitle={safeIssue.title}
                category={safeIssue.category}
                location={safeIssue.location}
                status={status}
                qrId={qrId}
                downloadFileName={`issue-${trackingId}-qr.png`}
                isSuccessVariant={isSuccessModal}
                successDownloadLabel="Download"
              />

              {!isSuccessModal && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Location on Map</p>
                  {hasCoordinates ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ height: "160px" }}>
                      <NepalMapPicker value={coords} readOnly />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 h-32 flex flex-col items-center justify-center gap-1">
                      <MapPin className="w-7 h-7 text-red-400 opacity-40" />
                      <p className="text-xs text-gray-500">
                        {safeIssue.location || "Location unavailable"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — Details + Timeline */}
            <div className="flex flex-col gap-4">
              {/* Details */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Issue Details</p>
                <div className="space-y-2">
                  <DetailRow icon={<MdSubject className="w-4 h-4" />} label="Description">
                    <p className="text-sm text-gray-900 wrap-break-word line-clamp-3">
                      {safeIssue.description || "—"}
                    </p>
                  </DetailRow>

                  <div className="grid grid-cols-2 gap-2">
                    <DetailRow icon={<MdLabel className="w-4 h-4" />} label="Category">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(safeIssue.category)}`}>
                        {safeIssue.category || "—"}
                      </span>
                    </DetailRow>

                    <DetailRow icon={<MdFlag className="w-4 h-4" />} label="Priority">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs capitalize ${getPriorityBadgeClass(safeIssue.priority)}`}>
                        {safeIssue.priority || "low"}
                      </span>
                    </DetailRow>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <DetailRow icon={<MdLocationOn className="w-4 h-4" />} label="Location">
                      <p className="text-xs text-gray-900 wrap-break-word">{safeIssue.location || "—"}</p>
                    </DetailRow>

                    <DetailRow icon={<MdRoom className="w-4 h-4" />} label="Ward">
                      <p className="text-xs text-gray-900">
                        {safeIssue.ward ? `Ward ${safeIssue.ward}` : "—"}
                      </p>
                    </DetailRow>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <DetailRow icon={<MdPerson className="w-4 h-4" />} label="Reporter">
                      <p className="text-xs text-gray-900 truncate">
                        {safeIssue.submittedBy || safeIssue.reportedBy || "—"}
                      </p>
                    </DetailRow>

                    <DetailRow icon={<MdCalendarToday className="w-4 h-4" />} label="Date">
                      <p className="text-xs text-gray-900">{safeIssue.date || "—"}</p>
                    </DetailRow>
                  </div>
                </div>
              </div>

              {/* Status Timeline — horizontal */}
              {!isSuccessModal && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Status Timeline</p>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-start gap-1">
                      {timelineSteps.map((t, idx) => {
                        const completed = idx + 1 <= step;
                        const Icon = t.Icon;
                        const isLast = idx === timelineSteps.length - 1;
                        return (
                          <div key={t.label} className="flex-1 flex flex-col items-center gap-1 relative">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                                completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {/* connector line */}
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
              )}
            </div>
          </div>

          {/* Photos — Before / After (permanent labels) */}
          {showPhotos && !isSuccessModal && (() => {
            const beforePhotos = safeIssue.beforePhotos || photos;
            const afterPhotos = safeIssue.afterPhotos || safeIssue.workPhotoUrls || [];

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

        {/* ── Sticky Footer ── */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-gray-100">
          {isSuccessModal ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrimary}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-colors"
              >
                View My Complaints
              </button>
              <button
                onClick={handleSecondary}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`${isTrackedVariant ? "w-full" : "w-full sm:w-auto"} inline-flex items-center justify-center px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-colors`}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
