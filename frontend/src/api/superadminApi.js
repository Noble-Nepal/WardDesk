import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const assignRole = (userId, newRoleId) =>
  axiosInstance.put(API_ENDPOINTS.ASSIGN_ROLE(userId), { newRoleId });
