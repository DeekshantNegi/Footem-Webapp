import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { OwnerContext } from "../context/OwnerContext.jsx";

const Navbar = ({ setShowAuthModal, setAuthMode }) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { ownerProfile } = useContext(OwnerContext);

  const location = useLocation();
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "My Bookings", path: "/mybookings" },
    { name: "Turfs", path: "/Turfs" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 md:px-10 h-16">

        {/* Logo */}
        <h1 className="text-white text-2xl font-bold tracking-wide">
          FOO<span className="text-[#b4e716]">TURF</span>
        </h1>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 w-[35%]">
          <input
            type="text"
            placeholder="Search turfs..."
            className="bg-transparent w-full outline-none text-white placeholder-gray-400"
          />
          <Search className="text-[#b4e716]" size={18} />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-white">

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-all duration-300 hover:text-[#b4e716] ${
                location.pathname === item.path ? "text-[#b4e716]" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {ownerProfile?.status === "verified" && (
            <Link
              to="/owner-dashboard"
              className={`text-sm font-medium transition-all duration-300 hover:text-[#b4e716] ${
                location.pathname === "/owner-dashboard" ? "text-[#b4e716]" : ""
              }`}
            >
              Dashboard
            </Link>
          )}

          {/* AUTH BUTTON */}
          {!user ? (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="bg-[#b4e716] text-black px-4 py-2 rounded-full font-semibold hover:scale-105 active:scale-95 transition-all"
            >
              Login / Signup
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center cursor-pointer"
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-black/90 border border-white/10 rounded-xl overflow-hidden text-white">
                  <Link className="block px-4 py-2 hover:bg-white/10" to="/profile">
                    Profile
                  </Link>

                  {ownerProfile && (
                    <Link className="block px-4 py-2 hover:bg-white/10" to="/owner-profile">
                      Owner
                    </Link>
                  )}

                  <button
                    onClick={async () => {
                      await logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400"
                  >
                    Logout <LogOut size={16} className="inline ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-16 right-0 w-2/3 h-screen bg-black/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-4 text-white">

          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
              {item.name}
            </Link>
          ))}

          {!user && (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
                setOpen(false);
              }}
              className="mt-4 bg-[#b4e716] text-black px-4 py-2 rounded-full font-semibold"
            >
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;