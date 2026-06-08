import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import footballImage from "../assets/signup-football.png";
import api from "../api/Axios";
import { validateSignup } from "../Utils/validatedata";

const Signup = ({ setAuthMode }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({});

    
     const validationErrors = validateSignup(formData);
     if (validationErrors) {
      setError(validationErrors);
       return;
     }

    setLoading(true);

    try {
      
      await api.post("/users/register", formData);

      console.log("Registering user:", formData);

      toast.success("Registration successful!");

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError({
        general: "Registration failed",
      });

      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    //<div className="w-full bg-white dark:bg-[#121212] flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-6xl bg-white dark:bg-[#1A1A1A] rounded-[40px] overflow-hidden shadow-2xl grid md:grid-cols-2">
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-white dark:bg-[#1A1A1A]">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            FOO<span className="text-[#b4e716]">TURF</span>
          </h1>
        </div>

        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            Create Your Account
          </h2>

          <p className="mt-3 text-lg text-gray-500">
            Join Footurf and start booking football turfs in seconds.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={footballImage}
            alt="Football"
            className="max-w-md w-full object-contain"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign Up
          </h2>

          <p className="mt-2 text-gray-500">
            Create your account and start playing
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-[#222222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b4e716] ${
                error.fullName
                  ? "border-red-500"
                  : "border-gray-200 dark:border-slate-700"
              }`}
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-[#222222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b4e716] ${
                error.email
                  ? "border-red-500"
                  : "border-gray-200 dark:border-slate-700"
              }`}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-[#222222]  dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b4e716] ${
                  error.password
                    ? "border-red-500"
                    : "border-gray-200 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#b4e716] hover:bg-white hover:text-black text-white font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Errors */}
            {error.fullName && (
              <p className="text-red-500 text-sm text-center">
                {error.fullName}
              </p>
            )}

            {error.email && (
              <p className="text-red-500 text-sm text-center">{error.email}</p>
            )}

            {error.password && (
              <p className="text-red-500 text-sm text-center">
                {error.password}
              </p>
            )}

            {error.general && (
              <p className="text-red-500 text-sm text-center">
                {error.general}
              </p>
            )}
          </form>

          <p className="text-center mt-8 text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="text-[#b4e716] font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Signup;
