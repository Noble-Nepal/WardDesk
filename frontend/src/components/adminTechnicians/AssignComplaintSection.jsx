import { useState } from "react";
export default function AssignComplaintSection({
  open,
  onClose,
  technicians,
  complaints,
  onAssign,
}) {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  if (!open) return null;

  // Filtering available techs by ward
  const techs = selectedComplaint
    ? technicians.filter(
        (t) =>
          t.wardNumber === selectedComplaint.wardNumber &&
          t.status === "active",
      )
    : [];

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-900">
            Assign Complaint to Technician
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 px-2 py-1 text-lg"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-medium mb-2 text-gray-900">
              Unassigned Complaints
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {complaints.map((c) => (
                <button
                  key={c.complaintId}
                  className={`px-3 py-2 rounded-lg border ${selectedComplaint?.complaintId === c.complaintId ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"} min-w-50`}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <div className="text-xs font-medium text-gray-900">
                    {c.complaintId}
                  </div>
                  <div className="text-sm text-gray-700">
                    {c.title || c.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.wardNumber && `Ward ${c.wardNumber}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {selectedComplaint && (
            <div>
              <div className="text-sm font-medium mb-2 text-gray-900">
                Available Technicians (Ward {selectedComplaint.wardNumber})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techs.length ? (
                  techs.map((t) => (
                    <div
                      key={t.userId}
                      className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {t.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ward {t.wardNumber}
                        </div>
                      </div>
                      <button
                        className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                        onClick={() => {
                          onAssign(selectedComplaint.complaintId, t.userId);
                          onClose();
                        }}
                      >
                        Assign
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm col-span-2 py-4">
                    No available technicians in this ward
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
