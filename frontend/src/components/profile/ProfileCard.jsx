import React from "react";

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center flex-col md:border-r md:pr-8 md:mr-8">
        {profile.profilePhotoUrl ? (
          <img
            src={profile.profilePhotoUrl}
            alt={profile.fullName}
            className="w-24 h-24 rounded-full object-cover border border-gray-200 mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 text-3xl font-semibold mb-2">
            {profile.fullName
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
        <div className="text-lg font-semibold text-gray-800">
          {profile.fullName}
        </div>
        <span className="text-sm text-gray-500">{profile.role}</span>
        <div
          className={`mt-2 inline-block px-2 py-0.5 rounded ${
            profile.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          } text-xs font-medium`}
        >
          {profile.isVerified ? "Verified" : "Pending"}
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex-1 w-full md:w-auto">
        <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-400">Email:</span>
            <div className="text-gray-700">{profile.email}</div>
          </div>
          <div>
            <span className="text-gray-400">Phone:</span>
            <div className="text-gray-700">{profile.phoneNumber}</div>
          </div>
          <div>
            <span className="text-gray-400">Address:</span>
            <div className="text-gray-700">{profile.address}</div>
          </div>
          <div>
            <span className="text-gray-400">Ward Number:</span>
            <div className="text-gray-700">{profile.wardNumber}</div>
          </div>
          <div>
            <span className="text-gray-400">Member Since:</span>
            <div className="text-gray-700">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <div className="text-gray-700">
              {profile.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
