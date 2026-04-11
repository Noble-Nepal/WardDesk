import React from "react";
import { User, Edit3, Save, X } from "lucide-react";

const inputBase =
  "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent";
const disabledInput = "bg-gray-50 text-gray-700 border-gray-200 cursor-default";
const enabledInput = "bg-white text-gray-900 border-gray-300";

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  readOnly,
  type = "text",
  disabled = false,
}) => (
  <div>
    <label className="text-sm text-gray-700 mb-1.5 block">{label}</label>
    <input
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      className={`${inputBase} ${readOnly || disabled ? disabledInput : enabledInput} ${error ? "border-red-500" : ""}`}
    />
    {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
  </div>
);

export default function ProfileEditForm({
  form,
  errors,
  isEditMode,
  onChange,
  onStartEdit,
  onCancel,
  onSave,
  saving,
  wards = [],
}) {
  const selectedArea = wards.find((a) => a.addressName === form.address);
  const wardOptions = selectedArea
    ? Array.from({ length: selectedArea.wardTo - selectedArea.wardFrom + 1 }, (_, i) => selectedArea.wardFrom + i)
    : [];

  const handleAddressChange = (e) => {
    onChange(e);
    onChange({ target: { name: "wardNumber", value: "" } });
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#2B4AA0]" />
          </div>
          <div>
            <h2 className="text-lg text-gray-900">Personal Information</h2>
            <p className="text-xs text-gray-500">
              Manage your personal details
            </p>
          </div>
        </div>

        {!isEditMode ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2B4AA0] text-[#2B4AA0] hover:bg-blue-50 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        ) : null}
      </div>

      <div className="p-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            error={errors.fullName}
            readOnly={!isEditMode}
          />
          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
            readOnly
            disabled
            type="email"
          />
          <Field
            label="Phone"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            error={errors.phoneNumber}
            readOnly={!isEditMode}
          />
          {/* Address — dropdown in edit mode */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">Full Address</label>
            {isEditMode ? (
              <select
                name="address"
                value={form.address ?? ""}
                onChange={handleAddressChange}
                className={`${inputBase} ${enabledInput} ${errors.address ? "border-red-500" : ""}`}
              >
                <option value="">Select address</option>
                {wards.map((a) => (
                  <option key={a.wardAreaId} value={a.addressName}>{a.addressName}</option>
                ))}
              </select>
            ) : (
              <input name="address" value={form.address ?? ""} readOnly className={`${inputBase} ${disabledInput}`} />
            )}
            {errors.address ? <p className="text-xs text-red-600 mt-1">{errors.address}</p> : null}
          </div>

          {/* Ward Number — range from selected address in edit mode */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">Ward Number</label>
            {isEditMode ? (
              <select
                name="wardNumber"
                value={form.wardNumber ?? ""}
                disabled={wardOptions.length === 0}
                onChange={onChange}
                className={`${inputBase} ${enabledInput} disabled:bg-gray-50 disabled:text-gray-400 ${errors.wardNumber ? "border-red-500" : ""}`}
              >
                <option value="">{form.address ? "Select ward number" : "Select address first"}</option>
                {wardOptions.map((w) => (
                  <option key={w} value={w}>Ward {w}</option>
                ))}
              </select>
            ) : (
              <input name="wardNumber" value={form.wardNumber ?? ""} readOnly className={`${inputBase} ${disabledInput}`} />
            )}
            {errors.wardNumber ? <p className="text-xs text-red-600 mt-1">{errors.wardNumber}</p> : null}
          </div>
        </div>

        {isEditMode ? (
          <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
