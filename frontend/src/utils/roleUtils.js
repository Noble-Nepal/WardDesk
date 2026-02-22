import { jwtDecode } from "jwt-decode";
import { getToken } from "./tokenUtils";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded[ROLE_CLAIM];
  } catch {
    return null;
  }
};

export const isAdmin = () => getRoleFromToken() === "admin";
export const isTechnician = () => getRoleFromToken() === "technician";
export const isCitizen = () => getRoleFromToken() === "citizen";
