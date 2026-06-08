import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/Axios.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { ownerProfile, loading } = useContext(OwnerContext);
  const [turfs, setTurfs] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalTurfs: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (ownerProfile && ownerProfile.status !== "verified") {
      toast.error("Access denied. Owner status must be verified.");
      navigate("/owner-profile");
      return;
    }
  }, [user, ownerProfile, navigate]);

  useEffect(() => {
    const fetchMyTurfs = async () => {
      if (!ownerProfile || ownerProfile.status !== "verified") return;

      try {
        const res = await api.get("/turfs/my-turfs");
        const ownerTurfs = res.data.data || [];
        setTurfs(ownerTurfs);
        setStats({
          totalBookings: ownerTurfs.reduce((sum, turf) => sum + (turf.bookings?.length || 0), 0),
          totalRevenue: ownerTurfs.reduce((sum, turf) => sum + (turf.priceperhour || 0), 0),
          totalTurfs: ownerTurfs.length,
        });
      } catch (err) {
        console.error("Failed to fetch owner turfs:", err.response?.data?.message || err.message);
      }
    };

    fetchMyTurfs();
  }, [ownerProfile]);

  if (loading) {
    return <Spinner />;
  }

  if (!ownerProfile || ownerProfile.status !== "verified") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
        <div className="max-w-4xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-8">
              Only verified owners can access this dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Owner <span className="text-[#b4e716]">Dashboard</span>
              </h1>
              <p className="text-gray-400">
                Welcome back, {ownerProfile.user?.fullName}! Manage your turfs and bookings.
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-turf")}
                className="bg-[#b4e716] hover:bg-[#9fd700] text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Turf
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-10"
        >
          {/* Total Turfs */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#b4e716] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold">Total Turfs</p>
                <p className="text-3xl font-bold mt-2">{stats.totalTurfs}</p>
              </div>
              <div className="bg-[#b4e716]/10 p-3 rounded-lg">
                <BarChart3 size={24} className="text-[#b4e716]" />
              </div>
            </div>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Calendar size={24} className="text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-green-500 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Active Users */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-purple-500 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold">Active Users</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Users size={24} className="text-purple-500" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-[#b4e716]" size={28} />
            Your Turfs
          </h2>

          {turfs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[#2a2a2a] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg mb-4">
                No turfs added yet. Start by adding your first turf!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-turf")}
                className="bg-gradient-to-r from-[#b4e716] to-[#9fd700] hover:shadow-lg hover:shadow-[#b4e716]/50 text-black font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Your First Turf
              </motion.button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.map((turf) => (
                <div
                  key={turf._id}
                  className="bg-[#2a2a2a] rounded-lg p-4 hover:border-[#b4e716] border border-gray-700 transition"
                >
                  <h3 className="font-bold text-lg mb-2">{turf.turfName}</h3>
                  <p className="text-gray-400 text-sm mb-4">{turf.location}</p>
                  <button className="w-full bg-[#b4e716] hover:bg-[#9fd700] text-black font-bold py-2 rounded-lg transition">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#b4e716] transition cursor-pointer">
            <Settings className="text-[#b4e716] mb-3" size={24} />
            <h3 className="font-bold text-lg mb-2">Settings</h3>
            <p className="text-gray-400 text-sm">Manage your account and preferences</p>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer">
            <BarChart3 className="text-blue-500 mb-3" size={24} />
            <h3 className="font-bold text-lg mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">View detailed booking and revenue analytics</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
