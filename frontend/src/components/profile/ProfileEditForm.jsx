import React, { useState } from "react";
import { updateMyProfile } from "../../api/profileApi";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ProfileEditForm({ profile, onProfileUpdated }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
    phoneNumber: profile.phoneNumber || "",
    wardNumber: profile.wardNumber || "",
    address: profile.address || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile(form);
      toast.success("Profile updated!");
      if (onProfileUpdated) onProfileUpdated();
    } catch {
      toast.error("Failed to update profile.");
    }
    setSaving(false);
  };

  const inputClass =
    "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Personal Information
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Update your personal details and contact information
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <FiUser className="text-gray-400" size={14} />
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <FiMail className="text-gray-400" size={14} />
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className={inputClass}
              placeholder="your@email.com"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <FiPhone className="text-gray-400" size={14} />
              Phone Number
            </label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="+977 XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <FiMapPin className="text-gray-400" size={14} />
              Ward Number
            </label>
            <input
              name="wardNumber"
              type="number"
              value={form.wardNumber}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Ward 5"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <FiMapPin className="text-gray-400" size={14} />
            Full Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Kathmandu, Nepal"
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
