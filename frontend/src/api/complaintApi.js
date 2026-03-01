import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Create a new complaint
export const createComplaint = (data) =>
  axiosInstance.post(API_ENDPOINTS.CREATE_COMPLAINT, data);

// Get logged-in user's complaints
export const getMyComplaints = () =>
  axiosInstance.get(API_ENDPOINTS.GET_MY_COMPLAINTS);

// Track complaint by trackingId
export const trackComplaint = (trackingId) =>
  axiosInstance.get(`${API_ENDPOINTS.TRACK_COMPLAINT}/${trackingId}`);

// Get complaint categories
export const getComplaintCategories = () =>
  axiosInstance.get(API_ENDPOINTS.COMPLAINT_CATEGORIES);
