import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdClose,
  MdDescription,
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
  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
    <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="relative bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose className="w-5 h-5 text-gray-500" />
          </button>

          <div className="pr-12">
            <p className="text-sm text-gray-500 mb-2">Complaint Title:</p>
            <h2 className="text-2xl sm:text-3xl text-gray-900 leading-tight break-words">
              {safeIssue.title}
            </h2>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex flex-col items-center space-y-6">
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
                <div className="w-full">
                  <h3 className="text-sm text-gray-500 mb-3">Location</h3>

                  {hasCoordinates ? (
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                      <NepalMapPicker value={coords} readOnly />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-48 flex flex-col items-center justify-center">
                      <MapPin className="w-10 h-10 text-red-500 opacity-30 mb-2" />
                      <p className="text-gray-600 text-sm mb-0.5">
                        {safeIssue.location || "Location unavailable"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Interactive map view
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-4">Issue Details</h3>
                <div className="space-y-3">
                  <DetailRow
                    icon={<MdDescription className="w-5 h-5" />}
                    label="Title"
                  >
                    <p className="text-sm text-gray-900 break-words">
                      {safeIssue.title}
                    </p>
                  </DetailRow>

                  <DetailRow
                    icon={<MdSubject className="w-5 h-5" />}
                    label="Description"
                  >
                    <p className="text-sm text-gray-900 break-words">
                      {safeIssue.description || "—"}
                    </p>
                  </DetailRow>

                  <DetailRow
                    icon={<MdLabel className="w-5 h-5" />}
                    label="Category"
                  >
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs ${getCategoryBadgeClass(
                        safeIssue.category,
                      )}`}
                    >
                      {safeIssue.category || "—"}
                    </span>
                  </DetailRow>

                  <DetailRow
                    icon={<MdLocationOn className="w-5 h-5" />}
                    label="Location"
                  >
                    <p className="text-sm text-gray-900 break-words">
                      {safeIssue.location || "—"}
                    </p>
                  </DetailRow>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailRow
                      icon={<MdFlag className="w-5 h-5" />}
                      label="Priority"
                    >
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs capitalize ${getPriorityBadgeClass(
                          safeIssue.priority,
                        )}`}
                      >
                        {safeIssue.priority || "low"}
                      </span>
                    </DetailRow>

                    <DetailRow
                      icon={<MdRoom className="w-5 h-5" />}
                      label="Ward"
                    >
                      <p className="text-sm text-gray-900">
                        {safeIssue.ward ? `Ward ${safeIssue.ward}` : "—"}
                      </p>
                    </DetailRow>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailRow
                      icon={<MdPerson className="w-5 h-5" />}
                      label="Reporter"
                    >
                      <p className="text-sm text-gray-900 truncate">
                        {safeIssue.submittedBy || safeIssue.reportedBy || "—"}
                      </p>
                    </DetailRow>

                    <DetailRow
                      icon={<MdCalendarToday className="w-5 h-5" />}
                      label="Date"
                    >
                      <p className="text-sm text-gray-900">
                        {safeIssue.date || "—"}
                      </p>
                    </DetailRow>
                  </div>
                </div>
              </div>

              {!isSuccessModal && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-4">
                    Status Timeline
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="space-y-4">
                      {timelineSteps.map((t, idx) => {
                        const completed = idx + 1 <= step;
                        const Icon = t.Icon;
                        return (
                          <div key={t.label} className="flex gap-3">
                            <div
                              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                completed
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <p
                              className={`text-sm ${completed ? "text-gray-900" : "text-gray-500"}`}
                            >
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

          {showPhotos && !isSuccessModal && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <MdImage className="w-4 h-4" />
                Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="rounded-xl overflow-hidden border border-gray-200 aspect-square"
                  >
                    <img
                      src={url}
                      alt={`${safeIssue.title} - Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8">
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
                className={`${isTrackedVariant ? "w-full" : "flex-1"} inline-flex items-center justify-center px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-colors`}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
