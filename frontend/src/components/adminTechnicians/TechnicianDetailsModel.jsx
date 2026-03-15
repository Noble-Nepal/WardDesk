import { useEffect, useRef } from "react";
import {
  XCircle,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  UserCheck,
  UserX,
  Home,
} from "lucide-react";

// --- Utility functions ---
function humanLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase())
    .replace("Id", "ID");
}
function formatDate(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function statusBadge(status) {
  if (!status)
    return {
      color: "bg-gray-100 text-gray-400 border border-gray-200",
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: "Unknown",
    };
  const s = status.toLowerCase();
  if (s === "pending")
    return {
      color: "bg-orange-100 text-orange-700 border border-orange-200",
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Pending Verification",
    };
  if (s === "active")
    return {
      color: "bg-green-100 text-green-700 border border-green-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Active",
    };
  if (s === "verified")
    return {
      color: "bg-blue-100 text-blue-700 border border-blue-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "Verified",
    };
  return {
    color: "bg-gray-100 text-gray-400 border border-gray-200",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: status,
  };
}

export default function TechnicianDetailsModal({
  open,
  technician,
  onClose,
  onApprove,
  onReject,
}) {
  const modalRef = useRef();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
  useEffect(() => {
    if (!open) return;
    function clickOut(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, [open, onClose]);

  if (!open || !technician) return null;

  const {
    fullName,
    email,
    phoneNumber,
    wardNumber,
    address,
    userId,
    registeredDate,
    status,
    profilePhoto,
    citizenshipPhoto,
    citizenshipPhotoUrl,
    specialization,
    completedTasks,
    assignedTasks,
    ...rest
  } = technician;

  // Always hide citizenship photo URL from info grid:
  const additionalFields = {
    "User ID": userId || technician.UserId,
    Ward: wardNumber || technician.WardNumber,
    Phone: phoneNumber || technician.PhoneNumber,
    Email: email || technician.Email,
    Address: address || technician.Address,
    "Registration Date": formatDate(
      registeredDate || technician.RegisteredDate || technician.createdAt,
    ),
    ...Object.entries(rest).reduce((acc, [k, v]) => {
      if (
        ![
          "status",
          "profilePhoto",
          "citizenshipPhoto",
          "citizenshipPhotoUrl",
          "specialization",
          "completedTasks",
          "assignedTasks",
        ].includes(k) &&
        typeof v !== "object"
      )
        acc[humanLabel(k)] = v;
      return acc;
    }, {}),
  };
  const badge = statusBadge((status || technician.Status || "").toLowerCase());
  const canApproveOrReject = (status || technician.Status) === "pending";
  const initials = (fullName || technician.FullName || "T")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Show photo if citizenshipPhoto (or citizenshipPhotoUrl) is present
  const citizenshipImage = citizenshipPhoto || citizenshipPhotoUrl;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col"
        ref={modalRef}
      >
        {/* HEADER */}
        <div className="relative bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
          <div className="pr-12">
            <h2 className="text-xl sm:text-2xl text-gray-900 mb-1">
              Technician Details
            </h2>
            <p className="text-xs text-gray-600">
              {canApproveOrReject
                ? "Review information before approval"
                : "Complete technician profile information"}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
          {/* Profile Block */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 mb-8">
            <div className="shrink-0 mb-3 md:mb-0">
              {profilePhoto ? (
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  src={profilePhoto}
                  alt={fullName + " photo"}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium border-4 border-white shadow-md">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-lg sm:text-xl text-gray-900 font-medium mb-1">
                {fullName}
              </div>
              <div className="text-sm text-gray-600 mb-4">{email}</div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.color}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
                {specialization && (
                  <span className="inline px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {specialization}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-4 h-4" /> Ward {wardNumber}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Phone className="w-4 h-4" /> {phoneNumber}
                </span>
                {address && (
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Home className="w-4 h-4" /> {address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div>
            <h3 className="text-sm text-gray-900 font-medium mb-3">
              Additional Information
            </h3>
            <div className="bg-gray-50 rounded-xl shadow border border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.entries(additionalFields).map(([label, value]) => (
                <div key={label}>
                  <span className="block text-xs text-gray-500">{label}</span>
                  <span className="block text-sm text-gray-900 mt-0.5">
                    {value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Citizenship Document */}
          {citizenshipImage && (
            <div className="mt-8">
              <h3 className="text-sm text-gray-900 font-medium mb-3">
                Citizenship Document
              </h3>
              <div className="bg-gray-50 rounded-xl shadow border border-gray-200 p-4">
                <img
                  src={citizenshipImage}
                  alt="Citizenship Document"
                  className="w-full max-h-100 object-contain rounded"
                  style={{ background: "#fff" }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Please verify the authenticity of the citizenship document
                  before approval.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            className="h-10 px-4 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
            onClick={onClose}
          >
            Close
          </button>
          {canApproveOrReject && (
            <>
              <button
                className="h-10 px-4 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium text-sm flex items-center"
                onClick={() => onReject && onReject(technician)}
              >
                <UserX className="w-4 h-4 mr-2" />
                Reject Application
              </button>
              <button
                className="h-10 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-sm flex items-center"
                onClick={() => onApprove && onApprove(technician)}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Approve Technician
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
