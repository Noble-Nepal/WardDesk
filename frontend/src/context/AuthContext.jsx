import { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";

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

  // Decode token and set user + role
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded[ID_CLAIM],
          email: decoded[EMAIL_CLAIM],
        });
        setRole(decoded[ROLE_CLAIM]);
      } catch {
        logout();
      }
    }
    setLoading(false);
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
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
