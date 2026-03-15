import { ClipboardList } from "lucide-react";

export default function HeaderSection({ onAssign }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Technician Management
          </h1>
          <div className="text-sm text-gray-600 mt-1">
            Verify and manage technician accounts
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          onClick={onAssign}
        >
          <ClipboardList size={16} />
          Assign Complaint
        </button>
      </div>
    </div>
  );
}
