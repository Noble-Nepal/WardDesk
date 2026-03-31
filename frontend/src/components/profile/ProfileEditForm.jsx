import React, { useState } from "react";
import { updateMyProfile } from "../../api/profileApi";
import { toast } from "react-hot-toast";
import handleImageUpload from "../../utils/handleImageUpload";

export default function ProfileEditForm({ profile, onProfileUpdated }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    phoneNumber: profile.phoneNumber || "",
    wardNumber: profile.wardNumber || "",
    address: profile.address || "",
    profilePhotoUrl: profile.profilePhotoUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Show local preview when a new file is selected (before upload)
  const [localPreview, setLocalPreview] = useState(form.profilePhotoUrl);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Optional: Show immediate local preview
      setLocalPreview(URL.createObjectURL(file));

      // Compress and upload to Cloudinary
      const url = await handleImageUpload(file);
      setForm((f) => ({ ...f, profilePhotoUrl: url }));
      setLocalPreview(url); // Now preview the Cloudinary copy
      toast.success("Profile photo uploaded!");
    } catch (err) {
      toast.error("Failed to upload photo - try again.");
      setLocalPreview(form.profilePhotoUrl); // revert
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile(form);
      toast.success("Profile updated!");
      if (onProfileUpdated) onProfileUpdated({ ...profile, ...form });
    } catch {
      toast.error("Failed to update profile.");
    }
    setSaving(false);
  };

  return (
    <form
      className="bg-white rounded-lg shadow p-6 mb-6 grid gap-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Full Name
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="Input"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Phone Number
        </label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className="Input"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="Input"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Ward Number
        </label>
        <input
          name="wardNumber"
          type="number"
          value={form.wardNumber}
          onChange={handleChange}
          className="Input"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          disabled={uploading}
        />
        <div className="mt-2 flex items-center gap-6">
          {localPreview && (
            <img
              src={localPreview}
              alt="Profile Preview"
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
          {uploading && (
            <span className="text-xs text-gray-500">Uploading...</span>
          )}
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`Button ${saving ? "opacity-50" : ""}`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
