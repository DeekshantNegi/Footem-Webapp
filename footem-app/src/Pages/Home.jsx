import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TurfContext } from "../context/TurfContext";
import { motion } from "framer-motion";
import HeroImg from "../assets/Heroimg.jpg";

import HeroVid from "../assets/HeroVid.mp4";
import Card from "../Components/Card";
import Live from "../assets/Live.webm";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

import turfdata from "../data/turf";

const Home = () => {
  const navigate = useNavigate();
  const { handleSelectedTurf } = useContext(TurfContext);
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = (e) => {
    const diff = startX.current - endX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % comments.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + comments.length) % comments.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [index]);

  const comments = [
    {
      text: "This app is amazing! It really helped me manage my schedule better.",
      author: "Riya",
    },
    {
      text: "Clean UI and easy to use. Highly recommend it!",
      author: "Aarav",
    },
    {
      text: "Customer support was quick and very helpful.",
      author: "Neha",
    },
  ];

  return (
    <div className="min-h-screen  w-full dark:bg-[#121212]">
      <div className="relative h-[99vh] w-full bg-center bg-cover bg-no-repeat">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HeroVid} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 w-full h-full"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{duration:1}}
          className="w-full  h-[70%] sm:h-[60%] p-[8vmin] flex flex-col justify-center items-center text-white leading-none drop-shadow-2xl "
          style={{ fontFamily: "Racing Sans One" }}
        >
          <h1 className="flex flex-wrap justify-center text-[14vmax] md:text-[140px] leading-[9vmax] md:leading-[4vmax]  mb-[20px] sm:mb-0">
            YOUR <span className="text-[#b4e716] z-5">FIELD</span>
          </h1>
          <h2 className="flex flex-wrap justify-center pl-[4vmax] md:pl-[0px] text-[14vmax] md:text-[120px] leading-[9vmax] md:leading-[3vmax]">
            <span className="sm:text-[#b4e716] z-5">YOUR</span> GAME
          </h2>
        </motion.div>
        <div className=""></div>
      </div>
<div className="bg-[#111111] px-8 py-10">

  {/* ── Featured Turfs Header ── */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-[#c8f028] text-xs font-semibold uppercase tracking-widest mb-1">
        Featured
      </p>
      <h1 className="text-white text-3xl font-bold">Featured Turfs</h1>
    </div>
    <button className="text-white text-sm flex items-center gap-1 hover:text-[#c8f028] transition-colors">
      View all <span>→</span>
    </button>
  </div>

  {/* ── Carousel ── */}
  <div className="relative">
    {/* Left Arrow */}
    <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-[#c8f028] transition-colors">
      ‹
    </button>

    <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] scroll-smooth pb-2">
      {turfdata.map((turf) => (
        <Card
          key={turf.id}
          turf={turf}
          onClick={() => (handleSelectedTurf(turf), navigate(`/turf/${turf.id}`))}
        />
      ))}
    </div>

    {/* Right Arrow */}
    <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-[#c8f028] transition-colors">
      ›
    </button>
  </div>
</div>

{/* ── Quick Booking ── */}
<div className="bg-white px-8 py-24">

  <div className="flex flex-col md:flex-row md:items-center gap-8">

    {/* Left: heading */}
    <div className="md:w-1/3">
      <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-2">
        Book in Seconds
      </p>
      <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">
        Quick Booking
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed">
        Select your preferred turf,<br />date, time and book instantly.
      </p>
    </div>

    {/* Right: inputs + button */}
    <div className="md:w-2/3 flex flex-col gap-4">
      {/* Input row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-sm">
          <span className="text-gray-400 text-sm">📍</span>
          <input
            type="text"
            placeholder="Select Location"
            className="text-sm text-gray-500 bg-transparent focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-sm">
          <span className="text-gray-400 text-sm">📅</span>
          <input
            type="text"
            placeholder="Select Date"
            className="text-sm text-gray-500 bg-transparent focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-sm">
          <span className="text-gray-400 text-sm">🕐</span>
          <input
            type="text"
            placeholder="Select Time"
            className="text-sm text-gray-500 bg-transparent focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-sm">
          <span className="text-gray-400 text-sm">👥</span>
          <input
            type="text"
            placeholder="Players"
            className="text-sm text-gray-500 bg-transparent focus:outline-none w-full placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Search button */}
      <button className="w-full bg-[#c8f028] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 shadow-md">
        Search Turfs 🔍
      </button>
    </div>
  </div>

  {/* ── Trust badges ── */}
  <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#c8f028] text-xl">⚡</span>
      <p className="text-sm text-gray-600 font-medium">Instant Confirmation</p>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#c8f028] text-xl">🛡️</span>
      <p className="text-sm text-gray-600 font-medium">No Hidden Charges</p>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#c8f028] text-xl">🔒</span>
      <p className="text-sm text-gray-600 font-medium">Pay Securely</p>
    </div>
  </div>

</div>

      <div className="w-full bg-[#121212] py-16 px-6">

  {/* ── Section Header ── */}
  <div className="text-center mb-12">
    <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-2">
      Testimonials
    </p>
    <h2 className="text-white text-3xl font-bold">What Players Say</h2>
    <div className="w-12 h-[3px] bg-[#c8f028] mt-3 rounded-full mx-auto" />
  </div>

  {/* ── Testimonial Card ── */}
  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 items-stretch">

    {/* Left: Feature list */}
    <div className="w-full sm:w-[40%] flex flex-col justify-center gap-5">
      {[
        { label: "Easy Online Booking", highlight: false },
        { label: "Affordable Rates",    highlight: true  },
        { label: "Verified Turfs",      highlight: false },
        { label: "Real-Time Availability", highlight: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-3 group">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            item.highlight ? "bg-[#c8f028]" : "bg-white/20"
          }`} />
          <h3 className={`font-semibold text-lg tracking-tight transition-colors ${
            item.highlight ? "text-[#c8f028]" : "text-white/80"
          }`}>
            {item.label}
          </h3>
        </div>
      ))}
    </div>

    {/* Right: Review card */}
    <div className="w-full sm:w-[60%] bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col gap-5
      hover:border-[#c8f028]/20 transition-all duration-300">

      {/* Quote icon */}
      <div className="text-[#c8f028] text-4xl leading-none font-serif">"</div>

      {/* Sliding reviews */}
      <div
        className="overflow-hidden w-full flex-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {comments.map((c, i) => (
            <div
              key={i}
              className="min-w-full flex flex-col gap-3"
            >
              <p className="text-gray-300 text-sm leading-relaxed">
                {c.text}
              </p>

              {/* Author row */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-9 h-9 rounded-full bg-[#c8f028]/10 border border-[#c8f028]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c8f028] text-xs font-bold uppercase">
                    {c.author?.[0] ?? "U"}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{c.author}</p>
                  {/* Star row */}
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-2">
        {comments.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? "bg-[#c8f028] w-5 h-1.5"
                : "bg-white/15 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</div>

      <div className="relative w-full h-[30vmax] md:h-[20vmax] flex justify-center items-center text-5xl sm:text-7xl overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute  w-full  object-cover"
          style={{
            objectFit: "contain",
            transformOrigin: "center",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 60%, transparent 80%)",
            maskImage:
              "radial-gradient(circle at center, black 60%, transparent 80%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        >
          <source src={Live} type="video/mp4" />
        </video>

        <h1
          className=" text-white items-center z-10"
          style={{
            fontFamily: "Racing Sans One",

            textShadow: `
                0 0 10px rgba(255,255,255,0.8),
                0 0 20px rgba(255,255,255,0.6),
                0 0 30px rgba(255,255,255,0.4)
              `,
          }}
        >
          Live the Game
        </h1>
      </div>

      <footer className="w-full bg-[#0a0a0a] text-gray-300 py-[3vmax]  overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between px-[3vmax] gap-10">
          {/* Left */}
          <div className="space-y-3">
            <h1 className="text-white text-2xl font-bold tracking-wide">
              FOO<span className="text-[#b4e716]">TURF</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-sm">
              Find, book, and play at the best turfs near you. Experience
              hassle-free booking and verified listings.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Quick Links
            </h2>
            <ul className="space-y-1 text-gray-400">
              <li className="hover:text-[#b4e716] cursor-pointer">Home</li>
              <li className="hover:text-[#b4e716] cursor-pointer">About</li>
              <li className="hover:text-[#b4e716] cursor-pointer">Contact</li>
              <li className="hover:text-[#b4e716] cursor-pointer">Terms</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p>Email: support@footurf.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="flex gap-4 mt-3">
              <FaFacebookF className="cursor-pointer hover:text-[#b4e716]" />
              <FaInstagram className="cursor-pointer hover:text-[#b4e716]" />
              <FaTwitter className="cursor-pointer hover:text-[#b4e716]" />
              <FaLinkedinIn className="cursor-pointer hover:text-[#b4e716]" />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Footurf. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
