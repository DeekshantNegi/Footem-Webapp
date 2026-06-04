import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Building2,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

export default function OwnerProfile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { ownerProfile, loading, error } = useContext(OwnerContext);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (!ownerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
        <div className="max-w-2xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">No Owner Application Found</h1>
            <p className="text-gray-400 mb-8">
              You haven't applied for owner status yet. Start your journey as a turf owner today!
            </p>
            <Link
              to="/apply-owner"
              className="inline-block bg-gradient-to-r from-[#b4e716] to-[#9fd700] hover:shadow-lg hover:shadow-[#b4e716]/50 text-black font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Apply for Owner <ArrowRight className="inline ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="text-green-500" size={24} />;
      case "pending":
        return <Clock className="text-yellow-500" size={24} />;
      case "rejected":
        return <XCircle className="text-red-500" size={24} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 border-green-500 text-green-500";
      case "pending":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-500";
      case "rejected":
        return "bg-red-500/10 border-red-500 text-red-500";
      default:
        return "bg-gray-500/10 border-gray-500 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Owner <span className="text-[#b4e716]">Profile</span>
            </h1>
            <p className="text-gray-400">Manage your owner application and details</p>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`bg-[#1a1a1a] border-2 rounded-xl p-8 mb-8 ${getStatusColor(ownerProfile.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(ownerProfile.status)}
                <div>
                  <h2 className="text-2xl font-bold capitalize">
                    {ownerProfile.status}
                  </h2>
                  <p className="text-sm opacity-80">
                    {ownerProfile.status === "verified" &&
                      "Your application has been approved!"}
                    {ownerProfile.status === "pending" &&
                      "Your application is under review. Please wait for admin approval."}
                    {ownerProfile.status === "rejected" &&
                      "Your application was rejected. Please review the details and apply again."}
                  </p>
                </div>
              </div>
              {ownerProfile.status === "verified" && (
                <Link
                  to="/owner-dashboard"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-[#b4e716]">
              <Building2 className="inline mr-2" size={24} />
              Business Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Turf Name */}
              <div>
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  Turf Name
                </label>
                <p className="text-lg font-semibold bg-[#2a2a2a] p-3 rounded-lg">
                  {ownerProfile.turfName}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Phone Number
                </label>
                <p className="text-lg font-semibold bg-[#2a2a2a] p-3 rounded-lg">
                  {ownerProfile.phone}
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  <MapPin className="inline mr-2" size={16} />
                  Location
                </label>
                <p className="text-lg font-semibold bg-[#2a2a2a] p-3 rounded-lg">
                  {ownerProfile.location}
                </p>
              </div>

              {/* Business License */}
              <div>
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  <FileText className="inline mr-2" size={16} />
                  Business License Number
                </label>
                <p className="text-lg font-semibold bg-[#2a2a2a] p-3 rounded-lg">
                  {ownerProfile.businessLicenseNumber}
                </p>
              </div>

              {/* ID Proof */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  ID Proof
                </label>
                <p className="text-lg font-semibold bg-[#2a2a2a] p-3 rounded-lg">
                  {ownerProfile.idProof}
                </p>
              </div>

              {/* User Info */}
              <div className="md:col-span-2 pt-4 border-t border-gray-700">
                <label className="text-sm text-gray-400 font-semibold block mb-2">
                  Associated User
                </label>
                <div className="bg-[#2a2a2a] p-3 rounded-lg">
                  <p className="font-semibold">
                    {ownerProfile.user?.fullName || "N/A"}
                  </p>
                  <p className="text-gray-400 text-sm">{ownerProfile.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p className="font-semibold">Applied on:</p>
                  <p>
                    {new Date(ownerProfile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Last updated:</p>
                  <p>
                    {new Date(ownerProfile.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4"
          >
            {ownerProfile.status === "rejected" && (
              <Link
                to="/apply-owner"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Apply Again
              </Link>
            )}
            <Link
              to="/profile"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
            >
              Back to Profile
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
