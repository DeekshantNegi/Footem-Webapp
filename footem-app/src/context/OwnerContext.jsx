import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/Axios.js";
import { AuthContext } from "./AuthContext.jsx";

export const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerApplication, setOwnerApplication] = useState(null);
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
      // Keep verified owner in `ownerProfile`, keep pending/rejected application in `ownerApplication`
      if (data?.status === "verified") {
        setOwnerProfile(data);
        setOwnerApplication(null);
      } else {
        setOwnerApplication(data);
        setOwnerProfile(null);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch owner profile";
      setError(errorMessage);
      setOwnerProfile(null);
      setOwnerApplication(null);
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
      // Application should not be treated as a verified owner until admin approves
      if (data?.status === "verified") {
        setOwnerProfile(data);
        setOwnerApplication(null);
      } else {
        setOwnerApplication(data);
        setOwnerProfile(null);
      }
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to apply for owner";
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
        ownerApplication,
        loading,
        error,
        applyForOwner,
        fetchOwnerProfile,
        setOwnerProfile,
        setOwnerApplication,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};
