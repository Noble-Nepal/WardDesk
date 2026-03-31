// src/components/profile/ProfileSettingsCore.jsx
import React, { useEffect, useState } from "react";
import { fetchMyProfile } from "../../api/profileApi";
import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm";
import PasswordChangeForm from "./PasswordChangeForm";
import DangerZoneSection from "./DangerZoneSection";
import { toast } from "react-hot-toast";

export default function ProfileSettingsCore() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMyProfile()
      .then((r) => setProfile(r.data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="PageLoader">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 space-y-8">
      <h1 className="text-2xl mb-2 font-bold text-gray-800">
        Profile Settings
      </h1>
      <ProfileCard profile={profile} />
      <ProfileEditForm profile={profile} onProfileUpdated={setProfile} />
      <PasswordChangeForm />
      <DangerZoneSection />
    </div>
  );
}
