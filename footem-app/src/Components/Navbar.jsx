import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const menuRef= useRef();

  useEffect(()=>{
    const handler = (e)=>{
      if(!menuRef.current?.contains(e.target)){
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return ()=>{ document.removeEventListener("mousedown", handler) };
  },[]);

  return (
    <div className="relative ">
      <nav
        className={` w-full h-[4em] lg:h-[5.5em] z-50 ${location.pathname === "/" ? "absolute top-0 left-0 " : "bg-[#0a0a0a]   top-0 left-0 shadow-2xl"}`}
      >
        <div className="flex justify-between ">
          <div>
            <h1
              className="text-white sm:mx-[2vmax] my-[1vmax] text-4xl"
              style={{ fontFamily: "BBH Sans Hegarty" }}
            >
              Footurf
            </h1>
          </div>

          <div className="flex w-full justify-end  md:px-[1.5vmax] py-[1vmax] gap-[0.5vw]  mx-[1.5vw] my-1">
            <div className="bg-gradient-to-r from-[#ffffff] to-[#D4DFED] flex rounded-full justify-end md:w-1/2 gap-[0.5rem] items-center p-[0.1em] shadow-2xl">
              <form className="hidden md:block w-full rounded-full focus:ring-0 ">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-[1.7em] p-[1em] focus:outline-none "
                />
              </form>
              <button className="bg-[#b4e716] rounded-full w-[45px] h-[40px] flex justify-center items-center">
                <Search />
              </button>
            </div>

            <ul className="hidden sm:flex justify-content items-center text-white text-[2.5vmax]  lg:text-[1.5em]  rounded-full px-[1vmax] space-x-[4vw] lg:space-x-[0.5vmax]">
              <li
                className={`hover:bg-black/10 hover:backdrop-blur-sm px-[1vmax] py-[0.1vmax] rounded-full transition duration-300 hover:text-[#b4e716] active:scale-95
              ${
                location.pathname === "/" ? "text-[#b4e716] bg-black/20 " : ""
              }`}
              >
                <Link to="/">Home</Link>
              </li>
              <li
                className={`hover:bg-black/5 hover:backdrop-blur-sm px-[1vmax] py-[0.1vmax] rounded-full transition duration-300 hover:text-[#b4e716] active:scale-95
              ${
                location.pathname === "/mybookings"
                  ? "text-[#b4e716] bg-black/20"
                  : ""
              }`}
              >
                <Link to="/mybookings">MyBookings</Link>
              </li>
              <li
                className={`hover:bg-black/5 hover:backdrop-blur-sm px-[1vmax] py-[0.1vmax] rounded-full transition duration-300 hover:text-[#b4e716] active:scale-95
              ${
                location.pathname === "/Turfs"
                  ? "text-[#b4e716] bg-black/20"
                  : ""
              }`}
              >
                <Link to="/Turfs">Turfs</Link>
              </li>
            </ul>

            <ul
              className={`fixed md:hidden w-1/2 flex flex-col top-0 right-0  h-full text-white bg-black/80 backdrop-blur-sm p-4 transform transition-all duration-300 ease-in-out z-10 ${
                open
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="mt-[1rem]">
                <li className=" rounded-lg mt-[0.5rem] py-2 active:text-[#b4e716]">
                  <Link to="/">Home</Link>
                </li>
                <li className=" rounded-lg mt-[0.5rem] py-2 active:text-[#b4e716]">
                  <Link to="/mybookings">MyBookings</Link>
                </li>
                <li className=" rounded-lg mt-[0.5rem] py-2 active:text-[#b4e716]">
                  <Link to="/Turfs">Turfs</Link>
                </li>
              </div>
            </ul>

           {!user ? (
              <div
                className={`flex items-center border-1 text-[0.8em] lg:text-[1vmax] font-semibold text-white hover:text-[#b4e716] px-4 py-1 rounded-full cursor-pointer active:scale-95 transition-all duration-300`}
              >
                <Link className="" to="/signup">
                  SignUp
                </Link>
              </div>
            ) : (
              <div className="relative rounded-full border-3 border-green-600 hover:border-green-500 bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-300">
                <div
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="cursor-pointer  hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full font-semibold border-2 border-white flex items-center justify-center">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {menuOpen && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-sm shadow-inner p-0.5 text-left z-5">
                     
                      <Link to="/profile" className="inline-block w-full px-4 py-2 hover:bg-gray-200 text-md font-semibold cursor-pointer hover:shadow active:scale-95 transition-all duration-300">Profile</Link>       
                  
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-gray-200 text-md text-left font-semibold cursor-pointer hover:shadow active:scale-95 transition-all duration-300 "
                    >
                      Logout <LogOut strokeWidth={2.3} className="inline ml-2 text-red-500 font-bold " />
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              className=" sm:hidden text-white z-50 "
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={28} /> : <Menu className=" " size={28} />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
