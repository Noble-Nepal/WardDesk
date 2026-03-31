import React, { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../../api/profileApi";
import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm";
import PasswordChangeForm from "./PasswordChangeForm";
import DangerZoneSection from "./DangerZoneSection";
import { toast } from "react-hot-toast";
import handleImageUpload from "../../utils/handleImageUpload";

export default function ProfileSettingsCore() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchMyProfile();
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, []);

  // Camera/photo upload handler
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading("Uploading profile photo...");
    try {
      // 1. Upload to Cloudinary
      const url = await handleImageUpload(file);
      // 2. Update backend
      await updateMyProfile({ profilePhotoUrl: url });
      // 3. Re-fetch profile
      await loadProfile();
      toast.dismiss();
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to upload/update photo.");
    }
    setUploading(false);
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your account information and preferences
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        <div>
          <ProfileCard
            profile={profile}
            onPhotoSelect={handlePhotoSelect}
            uploading={uploading}
          />
        </div>
        <div className="space-y-6">
          <ProfileEditForm profile={profile} onProfileUpdated={loadProfile} />
          <PasswordChangeForm />
          <DangerZoneSection />
        </div>
      </div>
    </div>
  );
}
