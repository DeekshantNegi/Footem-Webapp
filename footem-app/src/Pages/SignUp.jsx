import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IMG from "../assets/back.jpg";
import img from "../assets/img2.jpeg";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/Axios.js";
import { validateLogin, validateSignup } from "../Utils/validatedata.js";


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
  showPassword,
  setShowPassword,
  shake
}) => (
  <motion.div
    animate={{ x: isMobile ? "0%" : isSignUp ? "100%" : "0%" }}
    transition={swapform}
    className="absolute top-0 left-0 w-full md:w-1/2 h-full lg:p-14 p-6"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      {isSignUp ? "Create an Account" : "Welcome Back"}
    </h2>

    <motion.form onSubmit={handleSubmit} 
       key={shake}
       animate={{x:[0,-10, 10, -10, 10, 0],
             scale:[1, 1.02, 1]
       }}
       transition={{duration: 0.5}}
       className="space-y-4">
      
      {isSignUp && (
         <div>
          <input
            type="text"
            name="fullName"
            placeholder="FullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.fullName ? "border-red-500" : ""}`}
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
          className={`w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.email || error?.general ? "border-red-500" : ""}`}
        />
      </div>

       <div
         className="relative"
         >
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          className={` w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 ${error?.password || error?.general ? "border-red-500" : ""}`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer active:scale-105 transition-all duration-300 text-gray-600"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold cursor-pointer active:scale-95 transition-all duration-300"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
    </motion.form>

    <p className="text-center text-gray-600 mt-4">
      {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
      <button
        onClick={toggleForm}
        className="text-indigo-600 font-semibold hover:underline cursor-pointer"
      >
        {isSignUp ? "Sign In" : "Sign Up"}
      </button>
    </p>
    {
      error.fullName && (
        <p className="text-center text-red-500 mt-2 text-sm">{error.fullName}</p>
      )
    }
    {error.email && (
      <p className="text-center text-red-500 mt-2 text-sm">{error.email}</p>
    )}
    {error.password && (
      <p className="text-center text-red-500 mt-2 text-sm">{error.password}</p>
    )}
    {error.general && (
      <p className="text-center text-red-500 mt-2 text-sm">
        Invalid credentials
      </p>
    )}
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
  const [error, setError] = useState({
    field: {},
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(0);

  const { login } = useContext(AuthContext);

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let validationErrors = null;

    if (isSignUp) {
      validationErrors = validateSignup(formData);
    }
    else{
      validationErrors = validateLogin(formData);
    }

    if(validationErrors){
      setError(validationErrors);
      setShake(prev=> prev+1);
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Call signup API here
        const res = await api.post("/users/register", formData);
        setLoading(false);

        toast.success("Registration successful! Please sign in.");
        toggleForm();
      } else {
        // Call signin API here
        const res = await api.post("/users/login", formData);
        setLoading(false);
        login(res.data);
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      setLoading(false);
      const message ="Invalid credentials";
      setError((prev) => ({
        ...prev,
        general: message,
      }));
      setShake((prev)=> prev+1);
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
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            shake={shake}
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
