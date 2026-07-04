import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/Axios.js";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Ban,
  PlayCircle,
  X,
} from "lucide-react";

const STATUS_TABS = [
  { key: "pending", label: "Pending" },
  { key: "verified", label: "Verified" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  const [statusTab, setStatusTab] = useState("pending");
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [fetchingRequests, setFetchingRequests] = useState(true);
  const [fetchingTurfs, setFetchingTurfs] = useState(true);
  const [rejectModal, setRejectModal] = useState(null); // { userId, name } | null
  const [rejectReason, setRejectReason] = useState("");
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

  const fetchOwnerRequests = useCallback(async (status) => {
    try {
      setFetchingRequests(true);
      const res = await api.get(`/admin/owner-requests?status=${status}`);
      setOwnerRequests(res.data.data || []);
    } catch (err) {
      console.error("Failed to load owner requests:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to load owner requests.");
    } finally {
      setFetchingRequests(false);
    }
  }, []);

  const fetchTurfs = useCallback(async () => {
    try {
      setFetchingTurfs(true);
      const res = await api.get("/admin/turfs");
      setTurfs(res.data.data || []);
    } catch (err) {
      console.error("Failed to load turfs:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to load turfs.");
    } finally {
      setFetchingTurfs(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (loading || !user || user.role !== "admin" || dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchOwnerRequests(statusTab);
    fetchTurfs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  // Refetch when the tab changes (but skip the very first render, handled above)
  useEffect(() => {
    if (!dataFetchedRef.current) return;
    fetchOwnerRequests(statusTab);
  }, [statusTab, fetchOwnerRequests]);

  const removeRequestFromList = (userId) => {
    setOwnerRequests((current) => current.filter((request) => request.user._id !== userId));
  };

  const handleApproveOwner = async (userId) => {
    try {
      const response = await api.put(`/admin/approve-owner/${userId}`);
      toast.success(response.data.message || "Owner approved successfully.");
      removeRequestFromList(userId);
    } catch (err) {
      console.error("Approve owner failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to approve owner.");
    }
  };

  const openRejectModal = (userId, name) => {
    setRejectReason("");
    setRejectModal({ userId, name });
  };

  const confirmReject = async () => {
    if (!rejectModal) return;
    try {
      const response = await api.put(`/admin/reject-owner/${rejectModal.userId}`, {
        reason: rejectReason.trim() || undefined,
      });
      toast.success(response.data.message || "Owner request rejected.");
      removeRequestFromList(rejectModal.userId);
    } catch (err) {
      console.error("Reject owner failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to reject owner.");
    } finally {
      setRejectModal(null);
    }
  };

  // "Revoke" and "Reconsider" reuse the reject/approve endpoints so an admin
  // can move a request in either direction — this requires the pending-only
  // guard in approveOwner/rejectOwner to be loosened on the backend, since
  // right now those only accept transitions starting from "pending".
  const handleRevokeOwner = (userId) => openRejectModal(userId, undefined);
  const handleReconsiderOwner = (userId) => handleApproveOwner(userId);

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

  // Assumes a `turf.status` field ("active" | "suspended") and a not-yet-built
  // PATCH /admin/turfs/:turfId/status endpoint — flag if the real shape differs.
  const handleToggleTurfStatus = async (turf) => {
    const nextStatus = turf.status === "suspended" ? "active" : "suspended";
    try {
      const response = await api.patch(`/admin/turfs/${turf._id}/status`, { status: nextStatus });
      toast.success(response.data.message || `Turf ${nextStatus}.`);
      setTurfs((current) =>
        current.map((t) => (t._id === turf._id ? { ...t, status: nextStatus } : t)),
      );
    } catch (err) {
      console.error("Update turf status failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Unable to update turf status.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-28 bg-[#1f1f1f] rounded-[2rem] border border-gray-800 p-6" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-20 bg-[#1f1f1f] rounded-[2rem] border border-gray-800" />
                <div className="h-20 bg-[#1f1f1f] rounded-[2rem] border border-gray-800" />
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-[#1f1f1f] rounded-[2rem] border border-gray-800" />
                <div className="h-20 bg-[#1f1f1f] rounded-[2rem] border border-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={28} className="text-[#b4e716]" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">Owner Requests</p>
                <h2 className="text-2xl font-bold">Applications</h2>
              </div>
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 mb-6">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    statusTab === tab.key
                      ? "bg-[#b4e716] text-black"
                      : "bg-[#171717] text-gray-400 border border-gray-800 hover:border-[#b4e716]/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {fetchingRequests ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : ownerRequests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 p-10 text-center text-gray-400">
                No {statusTab} owner requests.
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
                        {statusTab === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveOwner(request.user._id)}
                              className="inline-flex items-center gap-2 bg-[#b4e716] hover:bg-[#9fd700] text-black font-semibold py-2 px-4 rounded-full transition"
                            >
                              <CheckCircle2 size={18} /> Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(request.user._id, request.user?.fullName)}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition"
                            >
                              <XCircle size={18} /> Reject
                            </button>
                          </>
                        )}

                        {statusTab === "verified" && (
                          <button
                            onClick={() => handleRevokeOwner(request.user._id)}
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition"
                          >
                            <Ban size={18} /> Revoke
                          </button>
                        )}

                        {statusTab === "rejected" && (
                          <button
                            onClick={() => handleReconsiderOwner(request.user._id)}
                            className="inline-flex items-center gap-2 bg-[#b4e716] hover:bg-[#9fd700] text-black font-semibold py-2 px-4 rounded-full transition"
                          >
                            <RotateCcw size={18} /> Reconsider
                          </button>
                        )}
                      </div>
                    </div>

                    {statusTab === "rejected" && request.rejectionReason && (
                      <p className="mt-3 text-sm text-red-400">
                        Reason: {request.rejectionReason}
                      </p>
                    )}

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

            {fetchingTurfs ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : turfs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-700 p-10 text-center text-gray-400">
                No turfs available.
              </div>
            ) : (
              <div className="space-y-4">
                {turfs.map((turf) => {
                  const isSuspended = turf.status === "suspended";
                  return (
                    <div
                      key={turf._id}
                      className="bg-[#171717] border border-gray-800 rounded-3xl p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-semibold">{turf.turfName}</p>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                isSuspended
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-[#b4e716]/10 text-[#b4e716]"
                              }`}
                            >
                              {isSuspended ? "Suspended" : "Active"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{turf.location}</p>
                          <p className="text-sm text-gray-400">Owner: {turf.owner?.fullName || turf.owner?.email || "Unknown"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleTurfStatus(turf)}
                            className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-full transition ${
                              isSuspended
                                ? "bg-[#b4e716] hover:bg-[#9fd700] text-black"
                                : "bg-yellow-600 hover:bg-yellow-700 text-white"
                            }`}
                          >
                            {isSuspended ? <PlayCircle size={18} /> : <Ban size={18} />}
                            {isSuspended ? "Activate" : "Suspend"}
                          </button>
                          <button
                            onClick={() => handleDeleteTurf(turf._id)}
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition"
                          >
                            <Trash2 size={18} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject reason modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setRejectModal(null)}
            />
            <motion.div
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              className="relative bg-[#171717] border border-gray-800 rounded-3xl p-6 w-full max-w-md"
            >
              <button
                onClick={() => setRejectModal(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold mb-1">
                {rejectModal.name ? `Reject ${rejectModal.name}?` : "Revoke owner status?"}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Add a reason so the applicant knows what to fix (optional, but recommended).
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g. Business license document is unreadable"
                className="w-full bg-[#0f0f0f] text-white text-sm rounded-xl border border-gray-800 focus:border-[#b4e716]/60 focus:outline-none p-3 mb-4 placeholder:text-gray-600"
              />
              <div className="flex gap-3">
                <button
                  onClick={confirmReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setRejectModal(null)}
                  className="flex-1 border border-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl transition hover:border-gray-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}