export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  PENDING_TECHNICIANS: "/admin/pending-technicians",
  VERIFY_TECHNICIAN: "/admin/verify-technician",
  REJECT_TECHNICIAN: "/admin/reject-technician",

  //Complaints
  CREATE_COMPLAINT: "/complaint",
  GET_MY_COMPLAINTS: "/complaint/my",
  GET_ALL_COMPLAINTS: "/complaint",
  TRACK_COMPLAINT: "/complaint/track",
  COMPLAINT_CATEGORIES: "/complaint/categories",
  IMPACT_STATS: (citizenId) =>
    citizenId
      ? `/complaint/impact-stats?citizenId=${citizenId}`
      : "/complaint/impact-stats",
  VOTE: "/complaint/vote",
  MY_VOTE: (complaintId) => `/complaint/${complaintId}/my-vote`,

  GET_ADMIN_ANALYTICS: "/analytics/admin-dashboard",

  // Technician management
  PENDING_TECHNICIANS: "/admin/pending-technicians",
  VERIFY_TECHNICIAN: "/admin/verify-technician",
  REJECT_TECHNICIAN: "/admin/reject-technician",
  GET_ALL_USERS: "/admin/users",
  // Assignment
  ASSIGN_COMPLAINT: "/assignment",
};
