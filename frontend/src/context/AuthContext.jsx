import { createContext, useState, useEffect, useCallback } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";
import { fetchMyProfile } from "../api/profileApi";

export const AuthContext = createContext();

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserProfile = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  useEffect(() => {
    const hydrateUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const baseUser = {
          userId: decoded[ID_CLAIM],
          email: decoded[EMAIL_CLAIM],
          profilePhotoUrl: "",
        };

        setUser(baseUser);
        setRole(decoded[ROLE_CLAIM]);

        try {
          const res = await fetchMyProfile();
          const p = res?.data || {};
          setUser((prev) => ({
            ...prev,
            profilePhotoUrl: p.profilePhotoUrl || "",
            fullName: p.fullName || "",
          }));
        } catch {
          // keep token-based user if profile call fails
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, [token]);

  const login = (accessToken, refreshToken) => {
    setToken(accessToken);
    setTokenState(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("refreshToken");
    setTokenState(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, loading, login, logout, setUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
