import React, { useEffect, useMemo, useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../../api/profileApi";
import handleImageUpload from "../../utils/handleImageUpload";

import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm";
import DangerZoneSection from "./DangerZoneSection";
import SuccessToast from "../ui/SuccessToast";
import ErrorAlert from "../ui/ErrorAlert";

import {
  PASSWORD_RULE_CHECKS,
  PROFILE_MESSAGES,
  getPasswordStrength,
} from "../../constants/profileSettingsConstants";
import {
  validatePersonalInfo,
  validatePasswordChange,
} from "../../utils/profileSettingsValidation";

const emptyPersonalForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  wardNumber: "",
  address: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfileSettingsCore() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [personalForm, setPersonalForm] = useState(emptyPersonalForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [personalErrors, setPersonalErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showPass, setShowPass] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const mapProfileToForm = (p) => ({
    fullName: p?.fullName || "",
    email: p?.email || "",
    phoneNumber: p?.phoneNumber || "",
    wardNumber: p?.wardNumber ?? "",
    address: p?.address || "",
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchMyProfile();
      const data = res?.data || {};
      setProfile(data);
      setPersonalForm(mapProfileToForm(data));
    } catch {
      setServerError(PROFILE_MESSAGES.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const strength = useMemo(
    () => getPasswordStrength(passwordForm.newPassword),
    [passwordForm.newPassword],
  );

  const passwordRules = useMemo(() => {
    const p = passwordForm.newPassword || "";
    return PASSWORD_RULE_CHECKS.map((r) => ({ ...r, met: r.test(p) }));
  }, [passwordForm.newPassword]);

  const passMatchState = useMemo(() => {
    if (!passwordForm.confirmPassword) return null;
    return passwordForm.newPassword === passwordForm.confirmPassword
      ? "match"
      : "mismatch";
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  const togglePasswordVisibility = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onPersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
    if (personalErrors[name]) {
      setPersonalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onStartEdit = () => setEditingProfile(true);

  const onCancelEdit = () => {
    if (!profile) return;
    setEditingProfile(false);
    setPersonalErrors({});
    setPersonalForm(mapProfileToForm(profile));
  };

  const onSaveProfile = async () => {
    const errors = validatePersonalInfo(personalForm);
    setPersonalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    setServerError("");
    setSuccessMsg("");

    try {
      await updateMyProfile({
        ...personalForm,
        email: profile?.email || personalForm.email,
        profilePhotoUrl: profile?.profilePhotoUrl || "",
      });

      await loadProfile();
      setEditingProfile(false);
      setSuccessMsg(PROFILE_MESSAGES.updateSuccess);
    } catch {
      setServerError(PROFILE_MESSAGES.updateError);
    } finally {
      setSavingProfile(false);
    }
  };

  const onClearPassword = () => {
    setPasswordForm(emptyPasswordForm);
    setPasswordErrors({});
  };

  const onUpdatePassword = async () => {
    const errors = validatePasswordChange(passwordForm);
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const wantsChange =
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.confirmPassword;
    if (!wantsChange) return;

    setSavingPassword(true);
    setServerError("");
    setSuccessMsg("");

    try {
      await changeMyPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm(emptyPasswordForm);
      setSuccessMsg(PROFILE_MESSAGES.passwordSuccess);
    } catch {
      setServerError(PROFILE_MESSAGES.passwordError);
    } finally {
      setSavingPassword(false);
    }
  };

  const onPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingPhoto(true);
    const tId = toast.loading("Uploading profile photo...");

    try {
      const uploadedUrl = await handleImageUpload(file);

      await updateMyProfile({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        wardNumber: profile.wardNumber,
        address: profile.address,
        profilePhotoUrl: uploadedUrl,
      });

      await loadProfile();
      toast.dismiss(tId);
      toast.custom((t) => (
        <div className={t.visible ? "animate-enter" : "animate-leave"}>
          <SuccessToast
            title="Photo Updated"
            message="Profile photo updated successfully."
          />
        </div>
      ));
    } catch {
      toast.dismiss(tId);
      setServerError(PROFILE_MESSAGES.photoError);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-70">
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const inputBase =
    "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent";
  const enabledInput = "bg-white text-gray-900 border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50">
      {successMsg ? (
        <div className="fixed top-20 right-6 z-200">
          <SuccessToast title="Success" message={successMsg} />
        </div>
      ) : null}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorAlert message={serverError} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <ProfileCard
              profile={profile}
              onPhotoSelect={onPhotoSelect}
              uploading={uploadingPhoto}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ProfileEditForm
              form={personalForm}
              errors={personalErrors}
              isEditMode={editingProfile}
              onChange={onPersonalChange}
              onStartEdit={onStartEdit}
              onCancel={onCancelEdit}
              onSave={onSaveProfile}
              saving={savingProfile}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg text-gray-900">Security Settings</h2>
                <p className="text-xs text-gray-500">
                  Manage your password and security preferences
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm text-gray-700 mb-1.5 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      name="currentPassword"
                      type={showPass.currentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={onPasswordChange}
                      className={`${inputBase} ${enabledInput} pr-10 ${
                        passwordErrors.currentPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass.currentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword ? (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.currentPassword}
                    </p>
                  ) : null}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-gray-700 mb-1.5 block">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showPass.newPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={onPasswordChange}
                        className={`${inputBase} ${enabledInput} pr-10 ${
                          passwordErrors.newPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass.newPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword ? (
                      <p className="text-xs text-red-600 mt-1">
                        {passwordErrors.newPassword}
                      </p>
                    ) : null}

                    {passwordForm.newPassword ? (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Password strength
                          </span>
                          <span className={strength.color}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.bar} transition-all duration-300`}
                            style={{ width: strength.width }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-1.5 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPass.confirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={onPasswordChange}
                        className={`${inputBase} ${enabledInput} pr-10 ${
                          passwordErrors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass.confirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword ? (
                      <p className="text-xs text-red-600 mt-1">
                        {passwordErrors.confirmPassword}
                      </p>
                    ) : null}

                    {passMatchState ? (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {passMatchState === "match" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs text-green-600">
                              Passwords match
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs text-red-600">
                              Passwords do not match
                            </span>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs text-gray-700 font-medium mb-2.5">
                    Password requirements:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-1.5">
                    {passwordRules.map((r) => (
                      <div key={r.key} className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.met ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            r.met ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClearPassword}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={onUpdatePassword}
                    disabled={savingPassword}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm disabled:opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    {savingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>

            <DangerZoneSection />
          </div>
        </div>
      </div>
    </div>
  );
}
