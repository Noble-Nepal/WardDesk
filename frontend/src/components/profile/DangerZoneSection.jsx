import React, { useState } from "react";
import { deactivateMyAccount, deleteMyAccount } from "../../api/profileApi";
import { toast } from "react-hot-toast";

export default function DangerZoneSection() {
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await deactivateMyAccount();
      toast.success("Account deactivated.");
      // Optionally log out user
    } catch {
      toast.error("Failed to deactivate account.");
    }
    setDeactivating(false);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible.",
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Account deleted.");
      // Optionally log out user and redirect
    } catch {
      toast.error("Failed to delete account.");
    }
    setDeleting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border-t-4 border-red-200">
      <h2 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
      <div className="mb-4">
        <button
          onClick={handleDeactivate}
          disabled={deactivating}
          className="Button bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 mr-2"
        >
          {deactivating ? "Deactivating..." : "Deactivate Account"}
        </button>
        <span className="text-sm text-gray-500 ml-1">
          — Temporarily disable your account.
        </span>
      </div>
      <div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="Button bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
        <span className="text-sm text-gray-500 ml-1">
          — Remove your account and data forever.
        </span>
      </div>
    </div>
  );
}
