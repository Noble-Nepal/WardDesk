import { useNavigate } from "react-router-dom";
import {
  MdClose,
  MdDescription,
  MdNotes,
  MdLabel,
  MdLocationOn,
  MdPerson,
  MdCalendarToday,
  MdCheck,
  MdArrowForward,
  MdFlag,
  MdRoom,
} from "react-icons/md";
import QRCodeSection from "./QRCodeSection";
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  TIMELINE_STEPS,
} from "../../../constants/reportIssueConstants";

const ComplaintDetails = ({ isOpen, onClose, issueData, variant }) => {
  const navigate = useNavigate();

  if (!isOpen || !issueData) return null;

  const isPageVariant = variant === "page";

  const handleViewComplaints = () => {
    onClose();
    navigate("/citizen/my-complaints");
  };

  const handleSubmitAnother = () => {
    onClose();
  };

  // Wrapper: modal backdrop vs full page
  const Wrapper = isPageVariant
    ? ({ children }) => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          {children}
        </div>
      )
    : ({ children }) => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          {children}
        </div>
      );

  return (
    <Wrapper>
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* ════════ HEADER ════════ */}
        <div className="relative bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Close Button */}
          {!isPageVariant && (
            <button
              onClick={onClose}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {/* Title */}
          <div className="pr-12">
            <p className="text-xs text-gray-500 mb-1">Complaint Title:</p>
            <h2 className="text-2xl sm:text-3xl text-gray-900 leading-tight wrap-break-word">
              {issueData.title}
            </h2>
          </div>
        </div>

        {/* ════════ CONTENT ════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* LEFT: QR Code */}
            <QRCodeSection
              trackingId={issueData.id}
              title={issueData.title}
              complaintData={issueData}
            />

            {/* RIGHT: Details + Timeline */}
            <div className="space-y-6">
              {/* ──── Issue Details ──── */}
              <div>
                <h3 className="text-sm text-gray-500 mb-4">Issue Details</h3>
                <div className="space-y-3">
                  {/* Title */}
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <MdDescription className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Title</p>
                      <p className="text-sm text-gray-900 wrap-break-word">
                        {issueData.title}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {issueData.description && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <MdNotes className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          Description
                        </p>
                        <p className="text-sm text-gray-900 wrap-break-word">
                          {issueData.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <MdLabel className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {issueData.category}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {issueData.location && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <MdLocationOn className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-sm text-gray-900 wrap-break-word">
                          {issueData.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Priority & Ward */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Priority */}
                    {issueData.priority && (
                      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <MdFlag className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Priority</p>
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs ${getPriorityBadgeClass(issueData.priority)}`}
                          >
                            {getPriorityLabel(issueData.priority)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Ward */}
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

                  {/* Reporter & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {issueData.submittedBy && (
                      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <MdPerson className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Reporter</p>
                          <p className="text-sm text-gray-900 wrap-break-word">
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

              {/* ──── Timeline ──── */}
              <div>
                <h3 className="text-sm text-gray-500 mb-4">
                  What Happens Next
                </h3>
                <div className="space-y-3">
                  {TIMELINE_STEPS.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      {/* Step Icon Column */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            step.active
                              ? "bg-green-500 text-white shadow-sm"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step.active ? (
                            <MdCheck className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {/* Connecting line */}
                        {index < TIMELINE_STEPS.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      {/* Step Content */}
                      <div
                        className={`flex-1 min-w-0 ${
                          index < TIMELINE_STEPS.length - 1 ? "pb-4" : ""
                        }`}
                      >
                        <p className="text-sm text-gray-900 mb-1">
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ════════ ACTION BUTTONS ════════ */}
          {!isPageVariant && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewComplaints}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition-colors"
              >
                View My Complaints
                <MdArrowForward className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={handleSubmitAnother}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors"
              >
                Submit Another
              </button>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default ComplaintDetails;
