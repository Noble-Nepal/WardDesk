import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const toQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.categoryId)
    params.append("categoryId", String(filters.categoryId));
  if (typeof filters.isVerified === "boolean") {
    params.append("isVerified", String(filters.isVerified));
  }

  const q = params.toString();
  return q ? `?${q}` : "";
};

export async function getAdminComplaints(filters = {}) {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}${toQueryString(filters)}`,
  );
  return res.data || [];
}

export async function getAdminComplaintById(complaintId) {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}/${complaintId}`,
  );
  return res.data;
}

export async function verifyAdminComplaint(complaintId) {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}/${complaintId}/verify`,
  );
  return res.data;
}

export async function unverifyAdminComplaint(complaintId) {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}/${complaintId}/unverify`,
  );
  return res.data;
}

export async function updateAdminComplaintCategory(complaintId, categoryId) {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}/${complaintId}/category`,
    { categoryId },
  );
  return res.data;
}

export async function updateAdminComplaintStatus(complaintId, statusName) {
  const res = await axiosInstance.put(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_MANAGEMENT}/${complaintId}/status`,
    { statusName },
  );
  return res.data;
}

export async function downloadAdminComplaintsPdf(filters = {}) {
  const res = await axiosInstance.get(
    `${API_ENDPOINTS.ADMIN_COMPLAINTS_REPORT_PDF}${toQueryString(filters)}`,
    { responseType: "blob" },
  );
  return res.data;
}

export async function getComplaintCategories() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_COMPLAINT_CATEGORIES);
  return res.data || [];
}
