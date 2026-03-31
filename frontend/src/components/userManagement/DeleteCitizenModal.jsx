import { Trash2, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteCitizenModal({
  open,
  onClose,
  citizen,
  onDeleteConfirm,
}) {
  if (!open || !citizen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-lg text-gray-900 mb-1">
            Delete Account Permanently
          </h2>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All data associated with this citizen
            will be permanently removed.
          </p>
        </div>
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <img
            src={citizen.profilePhoto}
            alt={citizen.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-red-200"
          />
          <div>
            <div className="text-sm text-gray-900">{citizen.name}</div>
            <div className="text-xs text-gray-500">{citizen.email}</div>
            <div className="text-xs text-gray-500">
              {citizen.ward} -- {citizen.reportedIssues} complaints
            </div>
          </div>
        </div>
        <div className="mx-6 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
          <div className="text-xs text-yellow-700">
            This will delete {citizen.reportedIssues} complaint(s) and all
            associated data permanently from the system.
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            type="button"
            onClick={onDeleteConfirm}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}
