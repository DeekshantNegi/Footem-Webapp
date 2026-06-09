import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { OwnerContext } from "../../context/OwnerContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../api/Axios.js";
import { validateUpdateProfile } from "../../Utils/validatedata.js";
import DefaultPic from "../../assets/nagi.jpeg";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImage from "./ProfileImage.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Spinner from "../../Components/Spinner.jsx";

export default function ProfilePage() {
  const [openEdit, setOpenEdit] = useState(false);
  const { user, setUser, logout } = useContext(AuthContext);
  const { ownerProfile } = useContext(OwnerContext);
  const [formdata, setFormdata] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const error = validateUpdateProfile(formdata, touched);
    if (error) { setErrors(error); return; }

    const updatedData = {};
    if (formdata.fullName !== user?.fullName) updatedData.fullName = formdata.fullName;
    if (formdata.email !== user?.email) updatedData.email = formdata.email;
    if (formdata.phone !== user?.phone) updatedData.phone = formdata.phone;

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes made to update");
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch("/users/userprofile", updatedData);
      toast.success("Profile updated successfully!");
      setUser(res.data.data);
      setOpenEdit(false);
    } catch (err) {
      setErrors({ general: "Failed to update profile" });
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (file) => {
    const oldUserAvatar = user;
    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatar: { ...prev.avatar, url: previewUrl } }));
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.patch("/users/avatar", formData);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Avatar updated successfully!");
    } catch (err) {
      toast.error("Failed to update avatar");
      setUser(oldUserAvatar);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // ── shared input style ──
  const inputClass = (field) =>
    `bg-[#121212] text-white text-sm w-full px-4 py-3 rounded-xl border 
    focus:outline-none focus:border-[#c8f028]/60 transition-colors placeholder:text-gray-600
    ${errors[field] ? "border-red-500/60" : "border-white/10"}`;

  return (
    <div className="min-h-screen bg-[#121212] pt-20 px-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-white text-3xl font-bold">My Profile</h1>
          <div className="w-12 h-[3px] bg-[#c8f028] mt-3 rounded-full" />
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6
          hover:border-[#c8f028]/20 transition-all duration-300">
          <ProfileImage
            image={user?.avatar?.url || DefaultPic}
            onImageChange={handleAvatarChange}
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-white text-xl font-bold">{user?.fullName || "User Name"}</h2>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            <p className="text-gray-600 text-xs mt-1">{user?.phone || "No phone added"}</p>
          </div>
          <button
            onClick={() => setOpenEdit((prev) => !prev)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 border
              ${openEdit
                ? "bg-transparent border-white/20 text-gray-400 hover:border-white/40"
                : "bg-[#c8f028] border-[#c8f028] text-black hover:brightness-110"
              }`}
          >
            {openEdit ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* ── Edit Form ── */}
        <AnimatePresence>
          {openEdit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6"
            >
              <h3 className="text-white font-bold text-base mb-1">Edit Profile</h3>
              <p className="text-gray-500 text-xs mb-5">Update your profile information below.</p>

              <form onSubmit={handlesubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 text-xs uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formdata.fullName}
                    onChange={handleChange}
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 text-xs uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formdata.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 text-xs uppercase tracking-widest">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formdata.phone}
                    onChange={handleChange}
                    className={inputClass("phone")}
                  />
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>

                {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c8f028] text-black font-bold py-3 rounded-xl 
                  hover:brightness-110 active:scale-95 transition-all duration-200 
                  flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <Spinner size={16} />}
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", value: "12" },
            { label: "Upcoming Matches", value: "2"  },
            { label: "Favourites",      value: "5"  },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-center
              hover:border-[#c8f028]/20 transition-all duration-300"
            >
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-[#c8f028] text-3xl font-bold">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold text-base mb-5">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/mybookings")}
              className="bg-[#c8f028] text-black text-sm font-bold px-5 py-2.5 rounded-xl
              hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/turfs")}
              className="bg-transparent border border-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-xl
              hover:border-[#c8f028]/40 hover:text-[#c8f028] active:scale-95 transition-all duration-200"
            >
              Explore Turfs
            </button>
            {!ownerProfile && (
              <button
                onClick={() => navigate("/apply-owner")}
                className="bg-transparent border border-yellow-500/30 text-yellow-400 text-sm font-medium px-5 py-2.5 rounded-xl
                hover:border-yellow-400/60 active:scale-95 transition-all duration-200"
              >
                Apply For Owner
              </button>
            )}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold text-base mb-5">Recent Activity</h3>
          <ul className="space-y-3">
            {[
              { icon: "⚽", text: `Booked "Green Turf Arena"` },
              { icon: "❌", text: "Cancelled a booking"         },
              { icon: "❤️", text: `Added "City Sports Ground" to favourites` },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-gray-400 text-sm py-2.5 border-b border-white/5 last:border-0"
              >
                <span className="text-base">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Settings ── */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-bold text-base">Settings</h3>
          <div className="h-px bg-white/5" />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setChangePasswordOpen((prev) => !prev)}
              className="bg-transparent border border-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-xl
              hover:border-[#c8f028]/40 hover:text-[#c8f028] active:scale-95 transition-all duration-200"
            >
              {changePasswordOpen ? "Cancel" : "Change Password"}
            </button>
            <button
              onClick={async () => { await logout(); navigate("/"); }}
              className="bg-transparent border border-red-500/30 text-red-400 text-sm font-medium px-5 py-2.5 rounded-xl
              hover:border-red-400/60 hover:bg-red-500/5 active:scale-95 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── Reset Password ── */}
        <AnimatePresence>
          {changePasswordOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ResetPassword />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}