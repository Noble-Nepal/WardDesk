import React, { useState } from "react";
import { deactivateMyAccount, deleteMyAccount } from "../../api/profileApi";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-hot-toast";
import SuccessToast from "../ui/SuccessToast";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const rowBtn =
  "px-4 py-2 text-sm rounded-lg whitespace-nowrap border transition";

export default function DangerZoneSection() {
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutAfterDelay = () => {
    setTimeout(async () => {
      try {
        await logoutUser();
      } catch {
        // ignore API logout failure and continue local logout
      } finally {
        logout();
        navigate("/login");
      }
    }, 2000);
  };

  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Temporarily disable your account? You can reactivate later.",
      )
    )
      return;
    setDeactivating(true);
    try {
      await deactivateMyAccount();
      toast.custom((t) => (
        <div className={t.visible ? "animate-enter" : "animate-leave"}>
          <SuccessToast
            title="Account Deactivated"
            message="Logging you out..."
          />
        </div>
      ));
      logoutAfterDelay();
    } catch {
      toast.error("Failed to deactivate account.");
    } finally {
      setDeactivating(false);
    }
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
      toast.custom((t) => (
        <div className={t.visible ? "animate-enter" : "animate-leave"}>
          <SuccessToast title="Account Deleted" message="Logging you out..." />
        </div>
      ));
      logoutAfterDelay();
    } catch {
      toast.error("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200">
      <div className="px-6 py-4 bg-red-50 border-b border-red-200">
        <h3 className="text-base text-red-700">Danger Zone</h3>
        <p className="text-xs text-red-500">
          Irreversible actions that affect your account
        </p>
      </div>

      <div className="p-6 space-y-3">
        <div className="p-4 rounded-lg border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-900 mb-0.5">Deactivate Account</p>
            <p className="text-xs text-gray-500">
              Temporarily disable your account. You can reactivate later.
            </p>
          </div>
          <button
            onClick={handleDeactivate}
            disabled={deactivating}
            className={`${rowBtn} border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50`}
          >
            {deactivating ? "Deactivating..." : "Deactivate"}
          </button>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-900 mb-0.5">Delete Account</p>
            <p className="text-xs text-gray-500">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`${rowBtn} border-red-500 text-red-700 hover:bg-red-50 disabled:opacity-50`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
