import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import { FileCheck, Phone, MapPin } from "lucide-react";

const ApplyForOwner = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { ownerProfile,  loading } = useContext(OwnerContext);

  const [formData, setFormData] = useState({
    turfName: "",
    phone: "",
    location: "",
    businessLicenseNumber: "",
    idProof: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect if already applied or verified
  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (ownerProfile) {
      toast.info("You have already applied for owner status");
      navigate("/owner-profile");
    }
  }, [user, ownerProfile, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.turfName?.trim()) {
      newErrors.turfName = "Turf name is required";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid 10-digit phone number required";
    }
    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.businessLicenseNumber?.trim()) {
      newErrors.businessLicenseNumber = "Business license number is required";
    }
    if (!formData.idProof?.trim()) {
      newErrors.idProof = "ID proof is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      await applyForOwner(formData);
      toast.success("Owner application submitted successfully!");
      navigate("/owner-profile");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Become a Turf <span className="text-[#b4e716]">Owner</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Expand your business and reach more customers. Complete the form below to get started.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Turf Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  <FileCheck className="inline mr-2" size={18} />
                  Turf Name
                </label>
                <input
                  type="text"
                  name="turfName"
                  value={formData.turfName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your turf name"
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.turfName && touched.turfName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#b4e716]"
                  } text-white placeholder-gray-500`}
                />
                {errors.turfName && touched.turfName && (
                  <p className="text-red-500 text-sm mt-1">{errors.turfName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  <Phone className="inline mr-2" size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter 10-digit phone number"
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.phone && touched.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#b4e716]"
                  } text-white placeholder-gray-500`}
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  <MapPin className="inline mr-2" size={18} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter turf location"
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.location && touched.location
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#b4e716]"
                  } text-white placeholder-gray-500`}
                />
                {errors.location && touched.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Business License Number */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  
                  Business License Number
                </label>
                <input
                  type="text"
                  name="businessLicenseNumber"
                  value={formData.businessLicenseNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter business license number"
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.businessLicenseNumber && touched.businessLicenseNumber
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#b4e716]"
                  } text-white placeholder-gray-500`}
                />
                {errors.businessLicenseNumber && touched.businessLicenseNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessLicenseNumber}
                  </p>
                )}
              </div>

              {/* ID Proof */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  ID Proof
                </label>
                <input
                  type="text"
                  name="idProof"
                  value={formData.idProof}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter ID proof number (Aadhaar/PAN/etc)"
                  className={`w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.idProof && touched.idProof
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#b4e716]"
                  } text-white placeholder-gray-500`}
                />
                {errors.idProof && touched.idProof && (
                  <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-[#b4e716] to-[#9fd700] hover:shadow-lg hover:shadow-[#b4e716]/50 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center"
              >
                {submitLoading ? (
                  <>
                    <Spinner />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 bg-[#1a1a1a] border border-[#b4e716]/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-[#b4e716]">What happens next?</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <span className="text-[#b4e716] mr-3 font-bold">1.</span>
                <span>Your application will be reviewed by our admin team</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#b4e716] mr-3 font-bold">2.</span>
                <span>We'll verify your business documents and details</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#b4e716] mr-3 font-bold">3.</span>
                <span>Once approved, you'll get access to the owner dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#b4e716] mr-3 font-bold">4.</span>
                <span>You can then manage your turfs, bookings, and analytics</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ApplyForOwner;
