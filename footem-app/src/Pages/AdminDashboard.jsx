import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/Axios.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (!loading && user?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Prevent duplicate API calls on re-renders
    if (loading || !user || user.role !== "admin" || dataFetchedRef.current) {
      return;
    }

    const fetchAdminData = async () => {
      try {
        setFetching(true);
        const [ownerRes, turfRes] = await Promise.all([
          api.get("/admin/owner-requests"),
          api.get("/admin/turfs"),
        ]);

        setOwnerRequests(ownerRes.data.data || []);
        setTurfs(turfRes.data.data || []);
        dataFetchedRef.current = true;
      } catch (err) {
        console.error("Failed to load admin data:", err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || "Unable to load admin data.");
      } finally {
        setFetching(false);
      }
    };

    fetchAdminData();
  }, [loading, user]);

  const handleApproveOwner = async (userId) => {
    try {
      const response = await api.put(`/admin/approve-owner/${userId}`);
      toast.success(response.data.message || "Owner approved successfully.");
      setOwnerRequests((current) => current.filter((request) => request.user._id !== userId));
    } catch (err) {
      console.error("Approve owner failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to approve owner.");
    }
  };

  const handleRejectOwner = async (userId) => {
    try {
      const response = await api.put(`/admin/reject-owner/${userId}`);
      toast.success(response.data.message || "Owner rejected successfully.");
      setOwnerRequests((current) => current.filter((request) => request.user._id !== userId));
    } catch (err) {
      console.error("Reject owner failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to reject owner.");
    }
  };

  const handleDeleteTurf = async (turfId) => {
    if (!window.confirm("Delete this turf permanently?")) return;

    try {
      const response = await api.delete(`/admin/turfs/${turfId}`);
      toast.success(response.data.message || "Turf deleted successfully.");
      setTurfs((current) => current.filter((turf) => turf._id !== turfId));
    } catch (err) {
      console.error("Delete turf failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to delete turf.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading || fetching) {
    return <Spinner />;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <ShieldAlert className="mx-auto mb-6 text-red-500" size={56} />
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center py-10 md:justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                Admin <span className="text-[#b4e716]">Dashboard</span>
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Manage owner applications, review active turfs, and take admin actions for the platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 mb-10">
          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={28} className="text-[#b4e716]" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">Owner Requests</p>
                <h2 className="text-2xl font-bold">Pending Applications</h2>
              </div>
            </div>

            {ownerRequests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 p-10 text-center text-gray-400">
                No pending owner requests at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {ownerRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-[#171717] border border-gray-800 rounded-3xl p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xl font-semibold">{request.user?.fullName || "Unknown User"}</p>
                        <p className="text-sm text-gray-400">{request.user?.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleApproveOwner(request.user._id)}
                          className="inline-flex items-center gap-2 bg-[#b4e716] hover:bg-[#9fd700] text-black font-semibold py-2 px-4 rounded-full transition"
                        >
                          <CheckCircle2 size={18} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectOwner(request.user._id)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="bg-[#0f0f0f] p-4 rounded-2xl">
                        <p className="text-gray-400 text-sm">Turf Name</p>
                        <p className="font-medium">{request.turfName}</p>
                      </div>
                      <div className="bg-[#0f0f0f] p-4 rounded-2xl">
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="font-medium">{request.location}</p>
                      </div>
                      <div className="bg-[#0f0f0f] p-4 rounded-2xl">
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="font-medium">{request.phone}</p>
                      </div>
                      <div className="bg-[#0f0f0f] p-4 rounded-2xl">
                        <p className="text-gray-400 text-sm">License</p>
                        <p className="font-medium">{request.businessLicenseNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trash2 size={28} className="text-[#b4e716]" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">Turf Management</p>
                <h2 className="text-2xl font-bold">Active Turfs</h2>
              </div>
            </div>

            {turfs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 p-10 text-center text-gray-400">
                No turfs available.
              </div>
            ) : (
              <div className="space-y-4">
                {turfs.map((turf) => (
                  <div
                    key={turf._id}
                    className="bg-[#171717] border border-gray-800 rounded-3xl p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xl font-semibold">{turf.turfName}</p>
                        <p className="text-sm text-gray-400">{turf.location}</p>
                        <p className="text-sm text-gray-400">Owner: {turf.owner?.fullName || turf.owner?.email || "Unknown"}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTurf(turf._id)}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
