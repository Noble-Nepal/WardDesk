import React from "react";
import {
  Camera,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Shield,
} from "lucide-react";

export default function ProfileCard({ profile, onPhotoSelect, uploading }) {
  const initials = profile?.fullName
    ?.split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <div className="h-24 bg-[#2B4AA0]" />

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative w-24 h-24 rounded-full bg-white ring-4 ring-white shadow-lg flex items-center justify-center">
            {profile?.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-[#2B4AA0] text-2xl font-semibold">
                {initials || "U"}
              </span>
            )}

            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#2B4AA0] hover:bg-[#1d3570] rounded-full border-2 border-white flex items-center justify-center cursor-pointer transition">
              <Camera className="w-3.5 h-3.5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-14 pb-6 px-6 text-center">
        <h3 className="text-lg text-gray-900">{profile?.fullName || "User"}</h3>
        <p className="text-sm text-gray-500 mb-3">Citizen Account</p>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </span>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 truncate">
              {profile?.email || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {profile?.phoneNumber || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {profile?.address || "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Member Since</span>
          </div>
          <span className="text-sm text-gray-900">
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">User ID</span>
          </div>
          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-900">
            {profile?.userId || "—"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Status</span>
          </div>
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>
    </div>
  );
}
