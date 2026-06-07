import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/Axios.js";
import { AuthContext } from "./AuthContext.jsx";

export const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch owner profile
  const fetchOwnerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/owners/me");
      const data = res.data.data;
      setOwnerProfile(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch owner profile";
      setError(errorMessage);
      setOwnerProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Apply for owner
  const applyForOwner = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/owners/apply", formData);
      const data = res.data.data;

      setOwnerProfile(data);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to apply for owner";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch owner profile when user changes
  useEffect(() => {
    if (user) {
      fetchOwnerProfile();
    } else {
      setOwnerProfile(null);
    }
  }, [user]);

  return (
    <OwnerContext.Provider
      value={{
        ownerProfile,
        loading,
        error,
        applyForOwner,
        fetchOwnerProfile,
        setOwnerProfile,
        
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};
