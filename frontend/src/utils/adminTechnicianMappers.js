export const normalizeTechnician = (u) => {
  const isVerified = Boolean(u.isVerified ?? u.IsVerified);
  const isActive = Boolean(u.isActive ?? u.IsActive);

  let accountStatus = "inactive";
  if (isActive) accountStatus = "active";
  if (!isVerified && isActive) accountStatus = "pending";

  return {
    userId: u.userId ?? u.UserId,
    fullName: u.fullName ?? u.FullName ?? "",
    email: u.email ?? u.Email ?? "",
    phoneNumber: u.phoneNumber ?? u.PhoneNumber ?? "",
    wardNumber: u.wardNumber ?? u.WardNumber,
    address: u.address ?? u.Address ?? "",

    profilePhotoUrl:
      u.profilePhotoUrl ??
      u.ProfilePhotoUrl ??
      u.profilePhoto ??
      u.ProfilePhoto ??
      "",

    citizenshipPhotoUrl:
      u.citizenshipPhotoUrl ??
      u.CitizenshipPhotoUrl ??
      u.citizenshipPhoto ??
      u.CitizenshipPhoto ??
      "",

    createdAt: u.createdAt ?? u.CreatedAt,
    isVerified,
    isActive,

    accountStatus,
    verificationStatus: isVerified ? "verified" : "unverified",

    completedTasks: Number(
      u.completedAssignments ?? u.CompletedAssignments ?? 0,
    ),
    activeTasks: Number(u.ongoingAssignments ?? u.OngoingAssignments ?? 0),
    assignmentStatus:
      Number(u.ongoingAssignments ?? u.OngoingAssignments ?? 0) > 0
        ? "busy"
        : "unassigned",
  };
};

export const normalizeComplaint = (c) => ({
  complaintId: c.complaintId ?? c.ComplaintId,
  title: c.title ?? c.Title ?? "",
  category: c.category ?? c.Category ?? "",
  wardNumber: c.wardNumber ?? c.WardNumber,
  address: c.address ?? c.Address ?? "",
  priority: (c.priority ?? c.Priority ?? "low").toLowerCase(),
  status: (c.status ?? c.Status ?? "pending").toLowerCase(),
  citizenName: c.citizenName ?? c.CitizenName ?? "Unknown",
  submittedDate:
    c.submittedDate ?? c.SubmittedDate ?? c.createdAt ?? c.CreatedAt,
  photo: c.photo ?? c.Photo ?? c.photoUrl ?? c.PhotoUrl ?? "",
});
