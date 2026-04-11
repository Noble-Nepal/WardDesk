export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Complaints
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

  // Admin analytics
  GET_ADMIN_ANALYTICS: "/analytics/admin-dashboard",

  // Technician management
  PENDING_TECHNICIANS: "/admin/pending-technicians",
  VERIFY_TECHNICIAN: "/admin/verify-technician",
  REJECT_TECHNICIAN: "/admin/reject-technician",
  UNVERIFY_TECHNICIAN: "/admin/unverify-technician",
  GET_ALL_USERS: "/admin/users",
  GET_ROLES: "/admin/roles",

  // Assignment
  ASSIGN_COMPLAINT: "/assignment",
  GET_UNASSIGNED_COMPLAINTS: "/assignment/unassigned-complaints",

  // Admin user management
  GET_ALL_CITIZENS: "/admin/citizens",
  GET_CITIZEN_BY_ID: (id) => `/admin/citizens/${id}`,
  UPDATE_USER_ROLE: (userId) => `/admin/users/${userId}/role`,
  DELETE_CITIZEN: (id) => `/admin/citizens/${id}`,

  // Superadmin
  ASSIGN_ROLE: (userId) => `/superadmin/users/${userId}/assign-role`,

  // Admin complaint management
  ADMIN_COMPLAINTS_MANAGEMENT: "/admin/complaints-management",
  ADMIN_COMPLAINTS_REPORT_PDF: "/admin/complaints-management/report/pdf",
  GET_COMPLAINT_CATEGORIES: "/complaint/categories",

  // Profile
  PROFILE: {
    ME: "/profile/me",
    UPDATE: "/profile/update",
    CHANGE_PW: "/profile/change-password",
    DEACTIVATE: "/profile/deactivate-account",
    DELETE: "/profile/delete-account",
  },
};
