import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Login from "../Pages/Login";
import Signup from "../Pages/SignUp";

const AuthModal = ({ mode, onClose, setAuthMode }) => {
  const [currentMode, setCurrentMode] = useState(mode);

  // sync with navbar changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-[#b4e716] transition-all duration-300"
        >
          <X size={32} />
        </button>

        <div className="animate-in fade-in zoom-in duration-300">
          {currentMode === "login" ? (
            <Login setAuthMode={setAuthMode} />
          ) : (
            <Signup setAuthMode={setAuthMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;