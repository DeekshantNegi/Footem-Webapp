import React from "react";

const StarRating = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${
          star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-700"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-yellow-400 text-xs font-semibold ml-0.5">{rating}</span>
  </div>
);

const Card = ({ turf, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`${className} group flex flex-col bg-[#1a1a1a] border border-white/5 
      rounded-2xl cursor-pointer overflow-hidden shadow-lg
      hover:border-[#c8f028]/30 hover:shadow-[0_0_24px_rgba(200,240,40,0.07)] 
      hover:scale-[1.02] transition-all duration-300`}
    >
      {/* ── Image ── */}
      <div className="w-full h-[180px] overflow-hidden relative">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/70 via-transparent to-transparent" />

        {/* Sport badge */}
        {turf.sport && (
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#c8f028] 
          text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-[#c8f028]/20">
            {turf.sport}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col gap-2.5">

        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-white text-sm font-bold leading-tight">{turf.name}</h2>
        </div>

        {/* Location */}
        <p className="text-gray-500 text-xs flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {turf.location}
        </p>

        <StarRating rating={turf.rating ?? 4.5} />

        {/* Divider */}
        <div className="h-px bg-white/5 mt-1" />

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Per Hour</p>
            <p className="text-[#c8f028] font-bold text-base">₹{turf.price}</p>
          </div>
          <div className="bg-[#c8f028]/10 border border-[#c8f028]/20 rounded-lg px-3 py-1.5
          group-hover:bg-[#c8f028] group-hover:border-[#c8f028] transition-all duration-300">
            <span className="text-[#c8f028] group-hover:text-black text-xs font-bold transition-colors duration-300">
              Book →
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Card;