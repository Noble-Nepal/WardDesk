import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const fetchCitizens = (params) =>
  axiosInstance.get(API_ENDPOINTS.GET_ALL_CITIZENS, { params });

export const fetchCitizenById = (id) =>
  axiosInstance.get(API_ENDPOINTS.GET_CITIZEN_BY_ID(id));

export const updateCitizenRole = (userId, newRoleId) =>
  axiosInstance.put(
    API_ENDPOINTS.UPDATE_USER_ROLE(userId),
    JSON.stringify(newRoleId),
    { headers: { "Content-Type": "application/json" } },
  );
export const deleteCitizen = (id) =>
  axiosInstance.delete(API_ENDPOINTS.DELETE_CITIZEN(id));
