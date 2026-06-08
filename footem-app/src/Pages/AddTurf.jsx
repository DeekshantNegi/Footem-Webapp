import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { OwnerContext } from "../context/OwnerContext.jsx";
import api from "../api/Axios.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";

export default function AddTurf() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { ownerProfile, loading } = useContext(OwnerContext);
  const [formData, setFormData] = useState({
    turfName: "",
    location: "",
    city: "",
    description: "",
    priceperhour: "",
    turfType: "5v5",
    amenities: "",
    openTime: "08:00",
    closeTime: "22:00",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (ownerProfile && ownerProfile.status !== "verified") {
      toast.error("Only verified owners can add a turf.");
      navigate("/owner-profile");
      return;
    }
  }, [user, ownerProfile, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { turfName, location, city, priceperhour } = formData;
    if (!turfName.trim() || !location.trim() || !city.trim() || !priceperhour.trim()) {
      toast.error("Turf name, location, city, and price are required.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one turf image.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      images.forEach((file) => payload.append("images", file));

      await api.post("/turfs", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Turf added successfully.");
      navigate("/owner-dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add turf.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 shadow-xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Add New Turf</h1>
            <p className="text-gray-400">
              Enter your turf details and upload photos so customers can discover your facility.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-gray-300">Turf Name</span>
                <input
                  type="text"
                  name="turfName"
                  value={formData.turfName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                  placeholder="Enter turf name"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Location</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                  placeholder="Enter turf location"
                  required
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-gray-300">City</span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                  placeholder="Enter city"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Price per hour</span>
                <input
                  type="number"
                  name="priceperhour"
                  value={formData.priceperhour}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                  placeholder="Enter price per hour"
                  min="0"
                  required
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-gray-300">Turf Type</span>
                <select
                  name="turfType"
                  value={formData.turfType}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                >
                  <option value="5v5">5v5</option>
                  <option value="6v6">6v6</option>
                  <option value="7v7">7v7</option>
                  <option value="8v8">8v8</option>
                  <option value="9v9">9v9</option>
                  <option value="11v11">11v11</option>
                </select>
              </label>

              <label className="block">
                <span className="text-gray-300">Amenities</span>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                  placeholder="e.g. Lights, Parking, Locker Room"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-gray-300">Open Time</span>
                <input
                  type="time"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Close Time</span>
                <input
                  type="time"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-gray-300">Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="mt-2 w-full rounded-3xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
                placeholder="Describe the turf"
              />
            </label>

            <label className="block">
              <span className="text-gray-300">Turf Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:outline-none focus:border-[#b4e716]"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#b4e716] hover:bg-[#9fd700] text-black font-bold py-3 px-8 rounded-xl transition duration-300 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Add Turf"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/owner-dashboard")}
                className="w-full sm:w-auto bg-white text-black font-bold py-3 px-8 rounded-xl transition duration-300 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
