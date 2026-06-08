import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import footballImage from "../assets/login-football.png";
import api from "../api/Axios";
import { validateLogin } from "../Utils/validatedata";
import { AuthContext } from "../context/AuthContext";

const Login = ({ setAuthMode } ) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    if (validationErrors) {
      setError(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/users/login", formData);

      login(res.data);

      toast.success("Login successful!");

      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);

      setError({
        general: "Invalid credentials",
      });

      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    
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
              Welcome
              Back!
            </h2>

            <p className="mt-4 text-lg text-gray-500">
              Login and continue your football journey.
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
              Sign In
            </h2>

            <p className="mt-2 text-gray-500">
              Enter your credentials to continue
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5"
            >
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-[#222222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b4e716] ${
                  error?.email || error?.general
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
                  className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-[#222222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b4e716] ${
                    error?.password || error?.general
                      ? "border-red-500"
                      : "border-gray-200 dark:border-slate-700"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-[#b4e716] hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#b4e716] hover:bg-white hover:text-black text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Errors */}
              {error?.general && (
                <p className="text-center text-red-500 text-sm">
                  {error.general}
                </p>
              )}

              {error?.email && (
                <p className="text-center text-red-500 text-sm">
                  {error.email}
                </p>
              )}

              {error?.password && (
                <p className="text-center text-red-500 text-sm">
                  {error.password}
                </p>
              )}
            </form>

            <p className="text-center mt-8 text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className="text-[#b4e716] font-semibold hover:underline"
            >
             Sign Up
            </button>
            </p>

          </div>
        </div>

      </div>
    
  );
};

export default Login;