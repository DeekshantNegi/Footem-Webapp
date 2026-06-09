import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TurfContext } from "../context/TurfContext";
import { BookingContext } from "../context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "react-calendar";
import { Calendar as CalendarIcon, MapPin, CheckCircle } from "lucide-react";
import Backimg from "../assets/Heroimg.jpg";

export default function TurfDetails() {
  // Mock availability for a selected date. Each slot has time, duration, status
  const initialSlots = [
    { id: "s1", time: "06:00AM - 07:00AM", available: true },
    { id: "s2", time: "07:00AM - 08:00AM", available: false },
    { id: "s3", time: "08:00AM - 09:00AM", available: true },
    { id: "s4", time: "09:00AM - 10:00AM", available: true },
    { id: "s5", time: "10:00AM - 11:00AM", available: false },
    { id: "s6", time: "05:00PM - 06:00PM", available: true },
    { id: "s7", time: "07:00PM - 08:00PM", available: true },
  ];

  const navigate = useNavigate();
  const { selectedTurf } = useContext(TurfContext);
  const { confirmBooking, allBookings } = useContext(BookingContext);

  const [slots, setSlots] = useState(initialSlots);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setselectedSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!selectedTurf) {
    navigate("/turfs");
    return null;
  }

  const selectSlot = (slot) => {
    if (!slot.available) return; // blocked
    setselectedSlotId(slot.id === selectedSlotId ? null : slot.id);
  };

  const bookselectedSlotId = () => {
    if (!selectedSlotId) return;
    setSlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlotId ? { ...s, available: false } : s
      )
    );
    const selectedSlot = slots.find((s) => s.id === selectedSlotId);

    confirmBooking({
      turf: selectedTurf,
      date: selectedDate,
      slot: selectedSlot,
    });
    setShowBookingModal(false);
    setselectedSlotId(null);

    // In a real app: call API to reserve slot and handle errors / race conditions
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 sm:p-6 md:p-12 "
      style={{
        backgroundImage: `url(${selectedTurf.image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 pt-10 lg:grid-cols-3 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-2 ">
          <div className="rounded-2xl sm:overflow-hidden shadow-lg ">
            <div className="relative">
              <img
                src={selectedTurf.image}
                alt={`${selectedTurf.name}`}
                className="w-full h-72 md:h-96 object-cover"
              />

              {/* floating info badge */}
              <div className="absolute left-4 top-4 bg-white/80 backdrop-blur rounded-xl px-4 py-2 flex items-center gap-3">
                <div className="text-sm">
                  <div className="text-lg font-semibold">
                    {selectedTurf.name}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <MapPin size={14} /> {selectedTurf.location}
                  </div>
                </div>
                <div className="ml-auto text-sm font-medium">
                  ₹{selectedTurf.price}/hr
                </div>
              </div>

              {/* image thumbnails 
              <div className="absolute left-4 right-4 bottom-4 flex gap-3 overflow-x-auto pb-2">
                {turf.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      i === selectedImage
                        ? "border-indigo-500"
                        : "border-transparent"
                    } shadow`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="w-24 h-14 object-cover"
                    />
                  </button>
                ))}
              </div>
              */}
            </div>

            {/* description & features */}
            <div className="p-6 -mt-3 sm:mt-0 bg-white/80 backdrop-blur-md rounded-t-2xl sm:rounded-none">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-2">About this turf</h2>
                <p className="text-gray-700 mb-4">
                  Premium hybrid turf with professional floodlights and
                  well-maintained grass. Suitable for 5-a-side and 7-a-side
                  matches. Popular for evening matches and training sessions.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle size={22} />
                    <div>
                      <div className="text-sm font-medium">Rating</div>
                      <div className="text-xs text-gray-600">
                        {selectedTurf.rating} / 5
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CalendarIcon size={22} />
                    <div>
                      <div className="text-sm font-medium">Calendar</div>
                      <div className="text-xs text-gray-600">Choose a date</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <div className="text-sm font-medium">Floodlights</div>
                      <div className="text-xs text-gray-600">
                        Perfect for nights
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right: Booking panel */}
        <aside className="bg-white rounded-t-2xl sm:rounded-2xl  p-6 shadow sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold">Book a slot</h4>
              <div className="text-sm text-gray-600">
                Selected date:{" "}
                <span className="font-medium">
                  {selectedDate.toDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                ₹{selectedTurf.price}/hr
              </div>
            </div>
          </div>

          <div className="mb-4">
            {/* lightweight calendar - swap as needed */}
            <div className="border rounded-lg p-2">
              <Calendar
                value={selectedDate}
                onChange={(d) => setSelectedDate(d)}
              />
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Available slots</h5>
            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => (
                <motion.button
                  key={slot.id}
                  onClick={() => selectSlot(slot)}
                  whileTap={{ scale: slot.available ? 0.97 : 1 }}
                  className={`text-sm p-3 rounded-lg border flex items-center justify-between gap-2 ${
                    slot.available
                      ? "cursor-pointer hover:shadow-lg"
                      : "opacity-60 cursor-not-allowed"
                  } ${
                    selectedSlotId === slot.id
                      ? "ring-2 ring-indigo-400 bg-indigo-50"
                      : "bg-white"
                  }`}
                >
                  <div className="text-left">
                    <div
                      className={`font-medium ${
                        slot.available ? "" : "text-gray-500"
                      }`}
                    >
                      {slot.time}
                    </div>
                    <div className="text-xs text-gray-500">1 hour</div>
                  </div>

                  <div>
                    {slot.available ? (
                      <div className="text-xs text-green-600 font-semibold">
                        Available
                      </div>
                    ) : (
                      <div className="text-xs text-red-500 font-semibold">
                        Booked
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={!selectedSlotId}
              className={`w-full py-3 rounded-lg active:scale-95 transition-all duration-300 ${
                selectedSlotId ? "cursor-pointer" : ""
              } font-semibold ${
                selectedSlotId
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 cursor-not-allowed"
              }`}
            >
              Reserve slot
            </button>

            <button
              onClick={() =>
                alert("Open directions in maps - replace with actual link")
              }
              className="mt-3 w-full py-2 rounded-lg border active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Get Directions
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <strong>Note:</strong> Slots are held for 10 minutes when reserved.
            Payments powered by your chosen gateway.
          </div>
        </aside>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowBookingModal(false)}
            ></div>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
            >
              <h3 className="text-lg font-bold mb-2 active:scale-95 transition-all duration-300">
                Confirm reservation
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You're booking{" "}
                <span className="font-medium">
                  {slots.find((s) => s.id === selectedSlotId)?.time}
                </span>{" "}
                on{" "}
                <span className="font-medium">
                  {selectedDate.toDateString()}
                </span>
                .
              </p>

              <div className="flex gap-3">
                <button
                  onClick={bookselectedSlotId}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-semibold active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Pay & confirm
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 rounded-lg border active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
