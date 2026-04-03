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
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
  return response.data;
};

export const resetPassword = async ({ oobCode, newPassword }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
    oobCode,
    newPassword,
  });
  return response.data;
};
