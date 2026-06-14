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

  const updateUser = (newUser) => {
    try {
      if (!newUser) {
        localStorage.removeItem("user");
        setUser(null);
      } else {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }
    } catch (err) {
      console.error("Failed to update user in storage:", err);
    }
  };

  const login = (userData) => {
    const u = userData?.data?.user || null;
    updateUser(u);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout", {});
      updateUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      updateUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {

      try {
        const res = await api.get("/users/userprofile");
        updateUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err.response?.data?.message || err.message);
        updateUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, updateUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
