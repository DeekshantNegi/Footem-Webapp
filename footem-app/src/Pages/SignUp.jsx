import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IMG from "../assets/back.jpg";
import img from "../assets/img2.jpeg";

const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log("Signing Up:", formData);
      // Call signup API here
    } else {
      console.log("Signing In:", formData);
      // Call signin API here
    }
  };

  const swapform = {
    type: "spring",
    duration: 0.9,
    stiffness: 100, 
    damping: 16,
  };

  const FormPanel =()=>(
     <motion.div
                key="form-left"
                layoutId="form-panel"
                transition={swapform}
                className="w-full md:w-1/2 lg:p-15 p-6"
              >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  {isSignUp ? "Create an Account" : "Welcome Back"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-indigo-400  "
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
                      required
                      className="w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 "
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-gray-300  px-2 py-2 focus:outline-none focus:border-indigo-400 "
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold cursor-pointer active:scale-95 transition-all duration-300"
                  >
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don’t have an account?"}{" "}
                  <button
                    onClick={toggleForm}
                    className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </motion.div>
    
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600"
      style={{ backgroundImage: `url(${IMG})`, backgroundSize: "cover" }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-1 w-full md:w-[60%]  flex"
        >
          {!isSignUp ? (
            <>
              <FormPanel  key="form-left"/>

              {window.innerWidth >= 768 && (
                <motion.div
                   key="image-right"
                  layoutId="image-panel"
                  transition={swapform}
                  animate={{zIndex:10}}
                  className="w-1/2 lg:h-[35vmax]  "
                >
                  <img
                    src={img}
                    className="w-full h-full rounded-r-2xl object-cover"
                    alt=""
                  />
                </motion.div>
              )}
            </>
          ) : (
            <>
              {window.innerWidth >= 768 && (
                <motion.div
                  key="image-right"
                  layoutId="image-panel"
                  transition={swapform}
                  className="w-1/2 lg:h-[35vmax] "
                >
                  <img
                    src={img}
                    className="w-full h-full rounded-l-2xl object-cover"
                    alt=""
                  />
                </motion.div>
                
              )}
               <FormPanel key="form-left" />
               
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Signup;
