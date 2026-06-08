import React, { useContext } from "react";
import { GiSoccerKick } from "react-icons/gi";
import { BookingContext } from "../context/BookingContext";

const MyBookings = () => {
  const { allBookings } = useContext(BookingContext);

  return (
    <div className="min-h-screen bg-[#121212] pt-20 px-6 pb-10">

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-1">
          Dashboard
        </p>
        <div className="flex items-end justify-between">
          <h1 className="text-white text-3xl font-bold">My Bookings</h1>
          {allBookings.length > 0 && (
            <span className="text-gray-500 text-sm">
              {allBookings.length} booking{allBookings.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="w-12 h-[3px] bg-[#c8f028] mt-3 rounded-full" />
      </div>

      {/* ── Empty State ── */}
      {allBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-20 h-20 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center">
            <GiSoccerKick className="text-4xl text-[#c8f028]" />
          </div>
          <h2 className="text-white text-xl font-semibold">No Bookings Yet</h2>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            You haven't booked any turf yet. Explore and book your first game!
          </p>
          <button className="mt-2 bg-[#c8f028] text-black text-sm font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all duration-200">
            Explore Turfs →
          </button>
        </div>

      ) : (

        /* ── Booking Cards ── */
        <div className="flex flex-col gap-4">
          {allBookings.map((booking, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#c8f028]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="w-full sm:w-52 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={booking.turf.image}
                  alt={booking.turf.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between p-5 gap-4 w-full">

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GiSoccerKick className="text-[#c8f028] text-xl" />
                      <h2 className="text-white text-lg font-bold">
                        {booking.turf.name}
                      </h2>
                    </div>
                    <p className="text-gray-500 text-sm">{booking.turf.location}</p>
                  </div>

                  {/* Price badge */}
                  <div className="bg-[#c8f028]/10 border border-[#c8f028]/20 rounded-lg px-3 py-1.5 text-right">
                    <p className="text-[#c8f028] font-bold text-base">₹{booking.turf.price}</p>
                    <p className="text-gray-500 text-xs">/ hour</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5" />

                {/* Meta info */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c8f028] text-xs">📅</span>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide">Date</p>
                      <p className="text-gray-300 text-sm font-medium">
                        {booking.date.toDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#c8f028] text-xs">🕐</span>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide">Time</p>
                      <p className="text-gray-300 text-sm font-medium">{booking.slot.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#c8f028] text-xs">📍</span>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wide">Location</p>
                      <p className="text-gray-300 text-sm font-medium">{booking.turf.location}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;