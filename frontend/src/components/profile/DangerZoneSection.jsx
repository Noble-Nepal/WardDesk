import React, { useState } from "react";
import { deactivateMyAccount, deleteMyAccount } from "../../api/profileApi";
import { toast } from "react-hot-toast";

export default function DangerZoneSection() {
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Temporarily disable your account? You can reactivate it later.",
      )
    )
      return;
    setDeactivating(true);
    try {
      await deactivateMyAccount();
      toast.success("Account deactivated.");
    } catch {
      toast.error("Failed to deactivate account.");
    }
    setDeactivating(false);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Permanently delete your account and all associated data? This cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Account deleted.");
    } catch {
      toast.error("Failed to delete account.");
    }
    setDeleting(false);
  };

  const dangerBtn =
    "ml-4 px-4 py-1.5 text-sm font-medium rounded-lg transition bg-white text-red-600 border border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50";
  return (
    <div className="bg-white rounded-xl border border-red-200 shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-red-100">
        <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Irreversible actions that affect your account
        </p>
      </div>
      <div className="p-6 space-y-3">
        {/* Deactivate row */}
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Deactivate Account
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Temporarily disable your account. You can reactivate it later.
            </p>
          </div>
          <button
            onClick={handleDeactivate}
            disabled={deactivating}
            className={dangerBtn}
          >
            {deactivating ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
        {/* Delete row */}
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Delete Account</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={dangerBtn}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
