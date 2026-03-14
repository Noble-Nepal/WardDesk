import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function getAdminDashboardAnalytics() {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_ADMIN_ANALYTICS);
  return res.data;
}
