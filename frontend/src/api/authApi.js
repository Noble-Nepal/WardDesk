import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
    refreshToken,
  });
  return response.data;
};
