import { ClipboardList } from "lucide-react";

export default function HeaderSection({ onAssign }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Technician Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Verify and manage technician accounts
          </p>
        </div>

        <button
          type="button"
          onClick={onAssign}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium shadow-sm transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Assign Complaint</span>
        </button>
      </div>
    </div>
  );
}
