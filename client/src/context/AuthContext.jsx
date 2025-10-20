import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("AuthContext: Checking auth status");
      console.log("AuthContext: Token present:", !!token);
      console.log("AuthContext: Stored user present:", !!storedUser);

      if (token && storedUser) {
        try {
          console.log("AuthContext: Verifying token with API");
          const response = await api.get("/auth/verify");
          console.log("AuthContext: Token verification successful:", response.data);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("AuthContext: Token verification failed:", error.response?.data || error.message);
          // Token is invalid, clear localStorage
          localStorage.clear();
          setUser(null);
        }
      } else {
        console.log("AuthContext: No token or user in localStorage");
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
