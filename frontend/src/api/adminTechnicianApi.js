import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  normalizeTechnician,
  normalizeComplaint,
} from "../utils/adminTechnicianMappers";

export async function getPendingTechnicians() {
  const res = await axiosInstance.get(API_ENDPOINTS.PENDING_TECHNICIANS);
  return (res.data || []).map(normalizeTechnician);
}

export async function getAllTechnicians() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS);
  return (res.data || [])
    .filter((u) => (u.role ?? u.Role ?? "").toLowerCase() === "technician")
    .map(normalizeTechnician);
}

export const verifyTechnician = (userId) =>
  axiosInstance.put(`${API_ENDPOINTS.VERIFY_TECHNICIAN}/${userId}`);

export const rejectTechnician = (userId) =>
  axiosInstance.put(`${API_ENDPOINTS.REJECT_TECHNICIAN}/${userId}`);

export const unverifyTechnician = (userId) =>
  axiosInstance.put(`${API_ENDPOINTS.UNVERIFY_TECHNICIAN}/${userId}`);

export async function getUnassignedComplaints() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_UNASSIGNED_COMPLAINTS);
  return (res.data || []).map(normalizeComplaint);
}
export const updateTechnicianAccountStatus = (userId, isActive, reason = "") =>
  axiosInstance.put(`/admin/users/${userId}/account-status`, {
    isActive,
    reason,
  });
export const assignComplaint = ({ complaintId, technicianId, remarks = "" }) =>
  axiosInstance.post(API_ENDPOINTS.ASSIGN_COMPLAINT, {
    complaintId,
    technicianId,
    remarks,
  });
