import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdClose,
  MdDescription,
  MdNotes,
  MdLabel,
  MdLocationOn,
  MdPerson,
  MdCalendarToday,
  MdFlag,
  MdRoom,
  MdImage,
} from "react-icons/md";
import { MapPin } from "lucide-react";

import { trackComplaint } from "../../api/complaintApi";
import NepalMapPicker from "../../components/map/mapPicker";
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusConfig,
} from "../../constants/reportIssueConstants";

export default function TrackComplaint() {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    trackComplaint(trackingId)
      .then((res) => setComplaint(res.data))
      .catch((err) => {
        console.error("Track error:", err);
        const msg = err.response
          ? `API Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
          : `Network Error: ${err.message}`;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [trackingId]);

  const issueData = useMemo(() => {
    if (!complaint) return null;
    return {
      id: complaint.trackingId,
      title: complaint.title,
      description: complaint.description || "",
      category: complaint.categoryName,
      location: complaint.locationAddress || "",
      submittedBy: complaint.citizenName || "",
      priority: complaint.priorityLevel,
      ward: complaint.wardNumber,
      status: complaint.statusName,
      date: new Date(complaint.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      photos: complaint.photoUrls || [],
    };
  }, [complaint]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading complaint status...</p>
        </div>
      </div>
    );
  }

  if (error || !issueData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdClose className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-500 text-lg mb-2">
            {error || "Complaint not found."}
          </p>
          <p className="text-gray-500 text-sm">Tracking ID: {trackingId}</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(issueData.status);
  const lat = Number(issueData.latitude);
  const lng = Number(issueData.longitude);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="relative bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="pr-12">
            <p className="text-xs text-gray-500 mb-1">Complaint Title:</p>
            <h2 className="text-2xl sm:text-3xl text-gray-900 leading-tight break-words">
              {issueData.title}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <p className="text-sm text-gray-500">
                Tracking ID:{" "}
                <span className="font-mono text-gray-700">#{issueData.id}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                <span
                  className={`w-2 h-2 rounded-full ${statusConfig.dotClass} ${
                    statusConfig.label !== "Resolved" &&
                    statusConfig.label !== "Closed"
                      ? "animate-pulse"
                      : ""
                  }`}
                />
                <span className={`text-xs ${statusConfig.textClass}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Map + Photos */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-3">Location</h3>
                {hasCoordinates ? (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                    <NepalMapPicker value={[lat, lng]} readOnly />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-48 flex flex-col items-center justify-center">
                    <MapPin className="w-10 h-10 text-red-500 opacity-30 mb-2" />
                    <p className="text-gray-600 text-sm mb-0.5">
                      {issueData.location || "Location unavailable"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Interactive map view
                    </p>
                  </div>
                )}
              </div>

              {issueData.photos.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <MdImage className="w-4 h-4" />
                    Photos ({issueData.photos.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {issueData.photos.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="rounded-xl overflow-hidden border border-gray-200 aspect-square"
                      >
                        <img
                          src={url}
                          alt={`${issueData.title} - Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4">Issue Details</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <MdDescription className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Title</p>
                    <p className="text-sm text-gray-900 break-words">
                      {issueData.title}
                    </p>
                  </div>
                </div>

                {issueData.description && (
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <MdNotes className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-900 break-words">
                        {issueData.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <MdLabel className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {issueData.category}
                    </span>
                  </div>
                </div>

                {issueData.location && (
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <MdLocationOn className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900 break-words">
                        {issueData.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueData.priority && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <MdFlag className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Priority</p>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs ${getPriorityBadgeClass(
                            issueData.priority,
                          )}`}
                        >
                          {getPriorityLabel(issueData.priority)}
                        </span>
                      </div>
                    </div>
                  )}

                  {issueData.ward && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <MdRoom className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Ward</p>
                        <p className="text-sm text-gray-900">
                          Ward {issueData.ward}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueData.submittedBy && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <MdPerson className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Reporter</p>
                        <p className="text-sm text-gray-900 break-words">
                          {issueData.submittedBy}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <MdCalendarToday className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-900 wrap-break-word">
                        {issueData.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
