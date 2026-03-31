import { X, Edit3, Save, ChevronDown, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

// Map backend role values to frontend display and roleId
const ROLES = [
  { label: "Citizen", value: "citizen", id: 1 },
  { label: "Technician", value: "technician", id: 2 },
  { label: "Admin", value: "admin", id: 3 },
];

export default function EditCitizenModal({
  open,
  onClose,
  citizen,
  editForm,
  setEditForm,
  onSave,
  loading,
}) {
  if (!open || !citizen) return null;
  const currentRole = citizen.role || "citizen";
  const selectedRoleObj =
    ROLES.find((r) => r.value === (editForm.role || currentRole)) || ROLES[0];
  const roleChanged = editForm.role && editForm.role !== currentRole;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg text-gray-900">Edit Citizen</h2>
              <p className="text-xs text-gray-500">
                Update citizen information
              </p>
            </div>
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            {citizen.profilePhoto ? (
              <img
                src={citizen.profilePhoto}
                alt={citizen.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xl text-gray-600">
                {citizen.name?.slice(0, 2).toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-900">{citizen.name}</p>
              <p className="text-xs text-gray-500">ID: #{citizen.id}</p>
            </div>
          </div>

          {/* Read only info */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              User Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Full Name</div>
                <div className="text-sm text-gray-900">{citizen.name}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm text-gray-900 truncate">
                  {citizen.email}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Phone</div>
                <div className="text-sm text-gray-900">{citizen.phone}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Ward</div>
                <div className="text-sm text-gray-900">{citizen.ward}</div>
              </div>
            </div>
          </div>

          {/* Editable role */}
          <div className="pt-2 border-t border-gray-100">
            <Label className="text-sm text-gray-700">Assign Role</Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-2">
              Change the user's role within the system
            </p>
            <div className="relative">
              <select
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={editForm.role || currentRole}
                onChange={(e) =>
                  setEditForm((form) => ({
                    ...form,
                    role: e.target.value,
                  }))
                }
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {roleChanged && (
              <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700">
                  Role will be changed from{" "}
                  <span className="capitalize">{currentRole}</span> to{" "}
                  <span className="capitalize">{editForm.role}</span>.
                </div>
              </div>
            )}
          </div>
        </div>
        {/* FOOTER */}
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
            disabled={!roleChanged || loading}
            className="bg-blue-500 text-white hover:bg-blue-600"
            type="button"
            onClick={() => onSave(selectedRoleObj)}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
