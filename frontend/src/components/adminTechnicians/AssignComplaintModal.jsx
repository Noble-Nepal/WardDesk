import { useState, useEffect, useRef } from "react";
import {
  XCircle,
  ClipboardList,
  MapPin,
  AlertCircle,
  Phone,
} from "lucide-react";

// Priority badge colors per your palette
function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-orange-100 text-orange-700";
    case "low":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
// "Mar 14, 2026"
function formatDate(dt) {
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function getInitials(fullName) {
  return (
    fullName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "T"
  );
}

export default function AssignComplaintModal({
  open,
  onClose,
  unassignedComplaints,
  technicians,
  handleAssign,
}) {
  const modalRef = useRef();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Close modal on esc
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const clickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        handleClose();
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [open]);

  function handleClose() {
    setSelectedComplaint(null);
    onClose && onClose();
  }

  // Only show verified/active techs
  const filteredTechs = technicians.filter((t) =>
    ["verified", "active"].includes(String(t.status).toLowerCase()),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl bg-white rounded-lg flex flex-col"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5 bg-white gap-4">
          <div>
            <div className="text-lg text-gray-900 font-bold">
              Assign Complaint to Technician
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              Select a complaint and assign it to an available technician
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
            aria-label="Close dialog"
            onClick={handleClose}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col space-y-5 flex-1 min-h-120">
          {/* Step 1: Unassigned Complaints */}
          <div>
            <div className="text-base text-gray-900 font-bold mb-3">
              Unassigned Complaints
            </div>
            <div className="space-y-3 mb-5">
              {Array.isArray(unassignedComplaints) &&
              unassignedComplaints.length > 0 ? (
                unassignedComplaints.map((complaint) => {
                  const isSel =
                    selectedComplaint &&
                    complaint.complaintId === selectedComplaint.complaintId;
                  return (
                    <div
                      key={complaint.complaintId}
                      className={`flex items-start rounded-lg overflow-hidden transition-all
                        cursor-pointer border
                        ${
                          isSel
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedComplaint(complaint)}
                      tabIndex={0}
                    >
                      {/* Left Photo */}
                      {complaint.photo && (
                        <div className="shrink-0 w-32 h-32">
                          <img
                            src={complaint.photo}
                            alt={complaint.title}
                            className="w-full h-full object-cover block"
                          />
                        </div>
                      )}
                      {/* Details */}
                      <div className="flex-1 min-w-0 p-4 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* ID/priority */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-900">
                              {complaint.complaintId}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs capitalize font-normal ${getPriorityColor(
                                complaint.priority,
                              )}`}
                            >
                              {complaint.priority}
                            </span>
                          </div>
                          {/* Title */}
                          <div className="text-base text-gray-900 font-medium mb-2">
                            {complaint.title}
                          </div>
                          {/* Category / Ward */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <ClipboardList className="w-3.5 h-3.5" />
                              {complaint.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {complaint.ward}
                            </span>
                          </div>
                          {/* Citizen / Date */}
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>By {complaint.citizenName || "Unknown"}</span>
                            <span>&#8226;</span>
                            <span>{formatDate(complaint.submittedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">
                    No unassigned complaints found.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Available Technicians */}
          <div>
            <div className="text-base text-gray-900 font-bold mb-4">
              Available Technicians
            </div>
            {selectedComplaint ? (
              filteredTechs.length > 0 ? (
                <div className="space-y-3">
                  {filteredTechs.map((tech) => (
                    <div
                      key={tech.userId}
                      className="flex items-center rounded-lg border border-gray-200 p-4 transition-all gap-4 hover:border-blue-300 hover:bg-blue-50"
                    >
                      {/* Technician photo or avatar */}
                      <div className="shrink-0">
                        {tech.profilePhoto ? (
                          <img
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            src={tech.profilePhoto}
                            alt={tech.fullName}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium border-2 border-blue-200">
                            {getInitials(tech.fullName)}
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-medium text-gray-900">
                            {tech.fullName}
                          </span>
                          {String(tech.status).toLowerCase() === "active" && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs ml-2">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                          {/* ---- LOCATION (address + ward) ---- */}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {tech.address
                              ? `${tech.address} • Ward ${tech.ward ?? tech.wardNumber ?? ""}`
                              : `Ward ${tech.ward ?? tech.wardNumber ?? ""}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {tech.phone}
                          </span>
                        </div>
                        {tech.specialization && (
                          <div className="text-xs text-gray-500">
                            Specialization: {tech.specialization}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          {typeof tech.completedTasks === "number" && (
                            <span>
                              <span className="text-green-700 font-medium">
                                {tech.completedTasks}
                              </span>
                              <span className="text-gray-500"> completed</span>
                            </span>
                          )}
                          {typeof tech.assignedTasks === "number" && (
                            <span>
                              <span className="text-blue-700 font-medium">
                                {tech.assignedTasks}
                              </span>
                              <span className="text-gray-500"> active</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Assign button */}
                      <div className="shrink-0 flex items-center">
                        <button
                          className="px-6 h-10 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                          onClick={async () => {
                            await handleAssign(selectedComplaint, tech);
                            handleClose();
                          }}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">
                    No available technicians
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <div className="text-sm text-gray-500">
                  Select a complaint to see available technicians
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
