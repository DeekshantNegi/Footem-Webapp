import React from "react";
import { GiSoccerKick } from "react-icons/gi";

import { useState, useContext } from "react";
import { BookingContext } from "../context/BookingContext";
const MyBookings = () => {
  const { allBookings } = useContext(BookingContext);
  return (
    <div className="m-4">
      <h1 className=" text-3xl font-semibold ">All Bookings</h1>
       <h2 className="text-gray-700 font-normal mb-4">Total number of bookings done: {allBookings.length}</h2>
      {allBookings.length > 0 ? (
        allBookings.map((booking, index) => (
          <div
            key={index}
            className="w-full p-2 flex flex-col sm:flex-row  text-gray-500 rounded-xl shadow-2xl"
          >
            <div className="w-full sm:w-60 rounded-2xl overflow-hidden mr-4">
              <img src={booking.turf.image} className="w-full h-full bg-cover" alt=""/>
            </div>
            <div className="flex flex-col justify-center">
            <div className=" flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-blue-900">
                {booking.turf.name}
              </h2>
              <GiSoccerKick className="text-3xl text-black" />
             </div>

            <p>Date: {booking.date.toDateString()}</p>
             <p>Time: {booking.slot.time}</p>
            <p>Destination: {booking.turf.location}</p>
            <p>Price: Rs{booking.turf.price}</p>
           </div>
          </div>
        ))
      ) : (
        <p>No bookings found</p>
      )}
    </div>
  );
};

export default MyBookings;
