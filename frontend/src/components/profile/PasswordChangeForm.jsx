import React, { useState } from "react";
import { changeMyPassword } from "../../api/profileApi";
import { toast } from "react-hot-toast";
import { FiShield, FiLock } from "react-icons/fi";

export default function PasswordChangeForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await changeMyPassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Failed to update password.");
    }
    setSaving(false);
  };

  const requirements = [
    "At least 8 characters long",
    "Contains uppercase and lowercase letters",
    "Contains at least one number",
    "Contains at least one special character",
  ];

  const inputClass =
    "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-2">
        <FiShield className="text-gray-500" size={18} />
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Security Settings
          </h2>
          <p className="text-sm text-gray-500">
            Manage your password and security preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Current Password */}
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <FiLock className="text-gray-400" size={14} />
            Current Password
          </label>
          <input
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter your current password"
            className={inputClass}
          />
        </div>

        {/* New + Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              className={inputClass}
            />
          </div>
        </div>

        {/* Requirements box */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Password requirements:
          </p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req}
                className="flex items-center gap-2 text-sm text-blue-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
