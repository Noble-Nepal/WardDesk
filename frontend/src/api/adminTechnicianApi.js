import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Get pending technicians
export async function getPendingTechnicians() {
  const res = await axiosInstance.get(API_ENDPOINTS.PENDING_TECHNICIANS);
  return res.data.map((t) => ({ ...t, status: "pending" }));
}

// Get all users and filter for technicians
export async function getAllTechnicians() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS);
  return res.data
    .filter(
      (u) =>
        u.role?.toLowerCase() === "technician" ||
        u.RoleName?.toLowerCase() === "technician",
    )
    .map((t) => ({
      ...t,
      status:
        t.isVerified || t.IsVerified
          ? t.isActive || t.IsActive
            ? "active"
            : "verified"
          : "pending",
      tasksDone: t.completedAssignments || t.CompletedAssignments || 0,
      tasksActive: t.ongoingAssignments || t.OngoingAssignments || 0,
    }));
}

export function verifyTechnician(userId) {
  return axiosInstance.put(`${API_ENDPOINTS.VERIFY_TECHNICIAN}/${userId}`);
}

export function rejectTechnician(userId) {
  return axiosInstance.put(`${API_ENDPOINTS.REJECT_TECHNICIAN}/${userId}`);
}

export async function getUnassignedComplaints() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_UNASSIGNED_COMPLAINTS);
  return res.data;
}

export function assignComplaint({ complaintId, technicianId, remarks }) {
  return axiosInstance.post(API_ENDPOINTS.ASSIGN_COMPLAINT, {
    complaintId,
    technicianId,
    remarks,
  });
}
