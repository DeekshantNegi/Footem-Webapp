import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Form, useNavigate } from "react-router-dom";
import api from "../../api/Axios.js";
import { validateUpdateProfile } from "../../Utils/validatedata.js";
import DefaultPic from "../../assets/nagi.jpeg";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ProfileImage from "./ProfileImage.jsx";
import Spinner from "../../Components/Spinner.jsx";

export default function ProfilePage() {
  const [openEdit, setOpenEdit] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [formdata, setFormdata] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };
  const handlesubmit = async (e) => {
    e.preventDefault();

    const error = validateUpdateProfile(formdata, touched);
    if (error) {
      setErrors(error);
      return;
    }

    const updatedData = {};

    if (formdata.fullName !== user?.fullName) {
      updatedData.fullName = formdata.fullName;
    }
    if (formdata.email !== user?.email) {
      updatedData.email = formdata.email;
    }

    if (formdata.phone !== user?.phone) {
      updatedData.phone = formdata.phone; // can be ""
    }

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes made to update");
      return;
    }

    // Handle form submission logic here
    try {
      setLoading(true);
      const res = await api.patch("/users/userprofile", updatedData);
      toast.success("Profile updated successfully!");
      setUser(res.data.data);
      setOpenEdit(false);
    } catch (err) {
      setErrors({
        general: "Failed to update profile",
      });
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (file) => {

    const oldUserAvatar= user;

    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({
      ...prev,
      avatar: { ...prev.avatar, url: previewUrl },
    }));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.patch("/users/avatar", formData);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
    } catch (err) {
      toast.error("Failed to update avatar");
      setUser(oldUserAvatar);
    }
    finally {
    // Clean up memory
    URL.revokeObjectURL(previewUrl);
  }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 👤 PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <ProfileImage
            image={user?.avatar?.url || DefaultPic}
            onImageChange={handleAvatarChange}
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {user?.fullName || "User Name"}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {user?.phone || "No phone added"}
            </p>
          </div>

          <button
            onClick={() => {
              setOpenEdit((prev) => !prev);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 active:scale-95 transition"
          >
            Edit Profile
          </button>
        </div>

        {openEdit && (
          <motion.div
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <p className="text-gray-500">
              Update your profile information here.
            </p>
            <form onSubmit={handlesubmit} className="mt-4 space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formdata.fullName}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formdata.email}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="tel"
                name="phone"
                placeholder="phone no."
                value={formdata.phone}
                onChange={(e) => handleChange(e)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition cursor-pointer active:scale-95 "
              >
                {loading && <Spinner size={18} />}
                {loading ? "Updating...":"Submit"}
              </button>

              {errors.general && (
                <p className="text-red-500 text-sm mt-2">{errors.general}</p>
              )}
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
              )}
            </form>
          </motion.div>
        )}

        {/* 📊 STATS CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h3 className="text-2xl font-bold text-green-600">12</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Upcoming Matches</p>
            <h3 className="text-2xl font-bold text-green-600">2</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Favorites</p>
            <h3 className="text-2xl font-bold text-green-600">5</h3>
          </div>
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              View My Bookings
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Explore Turfs
            </button>
          </div>
        </div>

        {/* 🕒 RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <ul className="space-y-3 text-gray-600 text-sm">
            <li>⚽ Booked "Green Turf Arena"</li>
            <li>❌ Cancelled a booking</li>
            <li>❤️ Added "City Sports Ground" to favorites</li>
          </ul>
        </div>

        {/* ⚙️ SETTINGS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              Change Password
            </button>

            <button className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
