import { createContext, useState, useEffect } from "react";
import api from "../api/Axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const data = localStorage.getItem("user");

      if (!data || data === "undefined") return null;

      return JSON.parse(data);
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);

  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData.data.user));
    setUser(userData.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout", {});
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.post("/users/refresh-token", {});

        const res = await api.get("/users/userprofile");
        setUser(res.data.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      } catch (err) {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
