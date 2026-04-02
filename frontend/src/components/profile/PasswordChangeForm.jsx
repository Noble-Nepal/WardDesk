import React, { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiShield } from "react-icons/fi";

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
  readOnly,
  visible,
  onToggle,
}) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
      <FiLock className="text-gray-400" size={14} />
      {label}
    </label>
    <div className="relative">
      <input
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-3 py-2 pr-10 rounded-lg text-sm border outline-none transition ${
          readOnly
            ? "bg-gray-100 border-gray-200 text-gray-700"
            : "bg-white border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        } ${error ? "border-red-500" : ""}`}
      />
      <button
        type="button"
        onClick={() => onToggle(name)}
        disabled={readOnly}
        className="absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 rounded flex items-center justify-center text-gray-600 disabled:opacity-40"
      >
        {visible ? (
          <FiEyeOff className="w-4 h-4" />
        ) : (
          <FiEye className="w-4 h-4" />
        )}
      </button>
    </div>
    {error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null}
  </div>
);

export default function PasswordChangeForm({
  form,
  errors,
  isEditMode,
  onChange,
  passwordStrength,
}) {
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const onToggle = (name) =>
    setShow((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-2">
        <FiShield className="text-gray-500" size={18} />
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Change Password
          </h2>
          <p className="text-sm text-gray-500">
            Keep your account secure with a strong password
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            error={errors.currentPassword}
            readOnly={!isEditMode}
            visible={show.currentPassword}
            onToggle={onToggle}
          />

          <div>
            <PasswordField
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              error={errors.newPassword}
              readOnly={!isEditMode}
              visible={show.newPassword}
              onToggle={onToggle}
            />

            {isEditMode ? (
              <div className="mt-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((seg) => (
                    <span
                      key={seg}
                      className={`h-2 rounded-full ${
                        seg <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {passwordStrength.label}
                </p>
              </div>
            ) : null}
          </div>

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            error={errors.confirmPassword}
            readOnly={!isEditMode}
            visible={show.confirmPassword}
            onToggle={onToggle}
          />
        </div>
      </div>
    </div>
  );
}
