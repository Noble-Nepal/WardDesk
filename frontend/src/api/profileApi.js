import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const fetchMyProfile = () => axiosInstance.get(API_ENDPOINTS.PROFILE.ME);

export const updateMyProfile = (data) =>
  axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE, data);

export const changeMyPassword = (data) =>
  axiosInstance.put(API_ENDPOINTS.PROFILE.CHANGE_PW, data);

export const deactivateMyAccount = () =>
  axiosInstance.post(API_ENDPOINTS.PROFILE.DEACTIVATE);

export const deleteMyAccount = () =>
  axiosInstance.delete(API_ENDPOINTS.PROFILE.DELETE);
