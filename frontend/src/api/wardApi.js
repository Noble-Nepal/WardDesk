import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Returns list of { wardAreaId, addressName, wardFrom, wardTo }
export const getWardAreas = () =>
  axiosInstance.get(API_ENDPOINTS.GET_WARD_AREAS);

export const addWardArea = (addressName, wardFrom, wardTo) =>
  axiosInstance.post(API_ENDPOINTS.ADD_WARD_AREA, { addressName, wardFrom, wardTo });

export const deleteWardArea = (wardAreaId) =>
  axiosInstance.delete(API_ENDPOINTS.DELETE_WARD_AREA(wardAreaId));
