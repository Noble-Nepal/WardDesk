import React, { useRef } from "react";
import { FiCamera, FiCheckCircle } from "react-icons/fi";

export default function ProfileCard({ profile, onPhotoSelect, uploading }) {
  const fileInputRef = useRef(null);

  const initials = profile.fullName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
      {/* Avatar */}
      <div className="relative mb-3">
        {profile.profilePhotoUrl ? (
          <img
            src={profile.profilePhotoUrl}
            alt={profile.fullName}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-semibold">
            {initials}
          </div>
        )}
        <label
          className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition"
          title="Change photo"
        >
          <FiCamera className="w-4 h-4 text-gray-500" />
          <input
            id="photo-upload-card"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPhotoSelect}
            ref={fileInputRef}
            disabled={uploading}
          />
        </label>
        {uploading && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-gray-500 animate-pulse bg-white rounded px-2 py-0.5 border">
            <span>Uploading...</span>
          </div>
        )}
      </div>

      <p className="text-base font-semibold text-gray-900">
        {profile.fullName}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        {profile.role || "Citizen Account"}
      </p>
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          profile.isVerified
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
        }`}
      >
        {profile.isVerified && <FiCheckCircle className="w-3 h-3" />}
        {profile.isVerified ? "Verified" : "Pending"}
      </span>

      <div className="w-full border-t border-gray-100 my-4" />

      <div className="w-full space-y-2 text-sm text-left">
        <div className="flex justify-between">
          <span className="text-gray-500">Member Since</span>
          <span className="font-medium text-gray-800">
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account Status</span>
          <span
            className={`font-medium ${profile.isActive ? "text-green-600" : "text-gray-400"}`}
          >
            {profile.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {profile.userId && (
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium text-gray-800">{profile.userId}</span>
          </div>
        )}
      </div>
    </div>
  );
}
