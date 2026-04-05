import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IMG from "../assets/back.jpg";
import img from "../assets/img2.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

const FormPanel = ({
  isSignUp,
  isMobile,
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  toggleForm,
  swapform,
}) => (
  <motion.div
    animate={{ x: isMobile ? "0%" : isSignUp ? "100%" : "0%" }}
    transition={swapform}
    className="absolute top-0 left-0 w-full md:w-1/2 h-full lg:p-14 p-6"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      {isSignUp ? "Create an Account" : "Welcome Back"}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="FullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
            required
            className={`w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.general ? "border-red-500" : ""}`}
          />
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          required
          className={`w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.email || error?.general ? "border-red-500" : ""}`}
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          minLength="6"
          required
          className={`w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.password || error?.general ? "border-red-500" : ""}`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold cursor-pointer active:scale-95 transition-all duration-300"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
    </form>

    <p className="text-center text-gray-600 mt-4">
      {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
      <button
        onClick={toggleForm}
        className="text-indigo-600 font-semibold hover:underline cursor-pointer"
      >
        {isSignUp ? "Sign In" : "Sign Up"}
      </button>
    </p>
    {error.email && (<p className="text-center text-red-500 mt-2 text-sm">{error.email}</p>)}
    {error.password && (<p className="text-center text-red-500 mt-2 text-sm">{error.password}</p>)}
  </motion.div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setIsSignUp(!isSignUp);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignUp && !formData.fullName) {
      newErrors.fullName = "Full Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password too short";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      toast.error("Please fix errors");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        console.log("Signing Up:", formData);
        // Call signup API here
        const res = await api.post("/users/register", formData);
        setLoading(false);
        toast.success("Registration successful! Please sign in.");
        toggleForm();
      } else {
        console.log("Signing In:", formData);
        // Call signin API here
        const res = await api.post("/users/login", formData);
        setLoading(false);
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const swapform = {
    type: "spring",
    duration: 0.9,
    stiffness: 100,
    damping: 16,
  };
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600"
      style={{ backgroundImage: `url(${IMG})`, backgroundSize: "cover" }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-2xl shadow-2xl p-1 w-full h-[600px] md:w-[60%] overflow-hidden "
        >
          <FormPanel
            isSignUp={isSignUp}
            isMobile={isMobile}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            toggleForm={toggleForm}
            swapform={swapform}
          />
          <motion.div
            transition={swapform}
            animate={{ x: isSignUp ? "-100%" : "0%" }}
            className="absolute top-0 right-0 w-1/2 h-full hidden md:block"
          >
            <img
              src={img}
              className="w-full h-full rounded-r-2xl object-cover"
              alt=""
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Signup;
