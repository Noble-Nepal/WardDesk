import React, { useState } from "react";
import { changeMyPassword } from "../../api/profileApi";
import { toast } from "react-hot-toast";

export default function PasswordChangeForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await changeMyPassword(form);
      toast.success("Password updated!");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error("Failed to update password.");
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
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          className="Input"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className="Input"
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          Password should be at least 8 characters, include uppercase, number,
          and special character.
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={`Button ${saving ? "opacity-50" : ""}`}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
