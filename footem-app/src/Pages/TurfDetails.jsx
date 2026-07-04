import { useState, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TurfContext } from "../context/TurfContext";
import { BookingContext } from "../context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "react-calendar";
import {
  Calendar as CalendarIcon,
  MapPin,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  X,
  Lightbulb,
  ParkingCircle,
  Shirt,
  Droplet,
  Coffee,
  Cross,
  ArrowRight,
} from "lucide-react";

// Theme tokens — the only two accent colors on the page.
const INK = "#1A1A1A";
const LIME = "#b4e716";

// Static amenity list — swap for selectedTurf.amenities when that data exists.
const AMENITIES = [
  { icon: Lightbulb, label: "Flood Lights" },
  { icon: ParkingCircle, label: "Parking" },
  { icon: Shirt, label: "Changing Room" },
  { icon: Droplet, label: "Water Facility" },
  { icon: CalendarIcon, label: "Washroom" },
  { icon: Coffee, label: "Cafeteria" },
  { icon: Cross, label: "First Aid" },
  { icon: ShieldCheck, label: "Equipment Rental" },
];

function nextSevenDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

const dayLabel = (d) => d.toLocaleDateString(undefined, { weekday: "short" });
const dateLabel = (d) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
const isSameDay = (a, b) => a.toDateString() === b.toDateString();

export default function TurfDetails() {
  // Mock availability for a selected date. Each slot has time, duration, status
  const initialSlots = [
    { id: "s1", time: "6:00 AM", end: "7:00 AM", status: "available" },
    { id: "s2", time: "7:00 AM", end: "8:00 AM", status: "available" },
    { id: "s3", time: "8:00 AM", end: "9:00 AM", status: "available" },
    { id: "s4", time: "9:00 AM", end: "10:00 AM", status: "available" },
    { id: "s5", time: "10:00 AM", end: "11:00 AM", status: "booked" },
    { id: "s6", time: "11:00 AM", end: "12:00 PM", status: "available" },
    { id: "s7", time: "12:00 PM", end: "1:00 PM", status: "available" },
    { id: "s8", time: "1:00 PM", end: "2:00 PM", status: "booked" },
    { id: "s9", time: "2:00 PM", end: "3:00 PM", status: "available" },
    { id: "s10", time: "3:00 PM", end: "4:00 PM", status: "available" },
    { id: "s11", time: "4:00 PM", end: "5:00 PM", status: "available" },
    { id: "s12", time: "5:00 PM", end: "6:00 PM", status: "available" },
    { id: "s13", time: "6:00 PM", end: "7:00 PM", status: "available", popular: true },
    { id: "s14", time: "7:00 PM", end: "8:00 PM", status: "available" },
    { id: "s15", time: "8:00 PM", end: "9:00 PM", status: "available" },
    { id: "s16", time: "9:00 PM", end: "10:00 PM", status: "unavailable" },
    { id: "s17", time: "10:00 PM", end: "11:00 PM", status: "unavailable" },
    { id: "s18", time: "11:00 PM", end: "12:00 AM", status: "available" },
  ];

  const navigate = useNavigate();
  const { selectedTurf } = useContext(TurfContext);
  const { confirmBooking } = useContext(BookingContext);

  const days = useMemo(() => nextSevenDays(), []);
  const [slots, setSlots] = useState(initialSlots);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef(null);

  if (!selectedTurf) {
    navigate("/turfs");
    return null;
  }

  const activeSlot = slots.find((s) => s.id === selectedSlotId);
  // Full gallery as uploaded by the turf owner — falls back to the single cover image if that's all there is.
  const gallery = selectedTurf.images?.length ? selectedTurf.images : [selectedTurf.image];

  const scrollToImage = (i) => {
    const node = galleryRef.current;
    if (!node) return;
    node.scrollTo({ left: i * node.clientWidth, behavior: "smooth" });
    setActiveImage(i);
  };

  const onGalleryScroll = (e) => {
    const node = e.currentTarget;
    const i = Math.round(node.scrollLeft / node.clientWidth);
    if (i !== activeImage) setActiveImage(i);
  };

  const selectSlot = (slot) => {
    if (slot.status !== "available") return;
    setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
  };

  const confirmReservation = () => {
    if (!activeSlot) return;
    setSlots((prev) =>
      prev.map((s) => (s.id === selectedSlotId ? { ...s, status: "booked" } : s))
    );
    confirmBooking({ turf: selectedTurf, date: selectedDate, slot: activeSlot });
    setShowBookingModal(false);
    setSelectedSlotId(null);
    // In a real app: call API to reserve slot and handle errors / race conditions
  };

  const statusStyle = {
    available: { border: "rgba(180,231,22,0.35)", bg: "rgba(180,231,22,0.06)", text: LIME },
    booked: { border: "rgba(255,255,255,0.06)", bg: "#202020", text: "#5c5c5c" },
    unavailable: { border: "rgba(239,68,68,0.25)", bg: "rgba(239,68,68,0.05)", text: "#7a4444" },
  };

  return (
    <div className="min-h-screen pb-28 relative" style={{ backgroundColor: INK }}>
      {/* Scoped dark theme for react-calendar, since it ships its own CSS */}
      <style>{`
        .turf-calendar.react-calendar { width: 100%; background: transparent; border: none; font-family: inherit; color: #F5F5F0; }
        .turf-calendar .react-calendar__navigation button { color: #F5F5F0; font-weight: 700; }
        .turf-calendar .react-calendar__navigation button:enabled:hover,
        .turf-calendar .react-calendar__navigation button:enabled:focus { background: rgba(180,231,22,0.12); border-radius: 8px; }
        .turf-calendar .react-calendar__month-view__weekdays { color: #8A8A8A; font-size: 0.7rem; text-transform: uppercase; font-weight: 700; }
        .turf-calendar .react-calendar__month-view__weekdays abbr { text-decoration: none; }
        .turf-calendar .react-calendar__tile { color: #E5E5E0; border-radius: 8px; padding: 0.6em 0.4em; }
        .turf-calendar .react-calendar__tile:enabled:hover,
        .turf-calendar .react-calendar__tile:enabled:focus { background: rgba(180,231,22,0.12); }
        .turf-calendar .react-calendar__tile--now { background: rgba(180,231,22,0.1); color: #b4e716; }
        .turf-calendar .react-calendar__tile--active { background: #b4e716 !important; color: #1A1A1A !important; font-weight: 800; }
        .turf-calendar .react-calendar__month-view__days__day--neighboringMonth { color: #4a4a4a; }
      `}</style>

      {/* Top bar — floats over the gallery, full width, no side gutters */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full border text-white focus-visible:outline-none focus-visible:ring-2"
          style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(26,26,26,0.55)", backdropFilter: "blur(6px)", outlineColor: LIME }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked((v) => !v)}
            className="p-2 rounded-full border focus-visible:outline-none focus-visible:ring-2"
            style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(26,26,26,0.55)", backdropFilter: "blur(6px)", outlineColor: LIME }}
            aria-label="Save turf"
          >
            <Heart size={18} color={liked ? LIME : "#fff"} fill={liked ? LIME : "none"} />
          </button>
          <button
            onClick={() => navigator.share?.({ title: selectedTurf.name })}
            className="p-2 rounded-full border text-white focus-visible:outline-none focus-visible:ring-2"
            style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(26,26,26,0.55)", backdropFilter: "blur(6px)", outlineColor: LIME }}
            aria-label="Share turf"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Full-bleed image gallery — every photo the turf owner uploaded, swipe/scroll through them */}
      <div className="relative">
        <div
          ref={galleryRef}
          onScroll={onGalleryScroll}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {gallery.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${selectedTurf.name} photo ${i + 1}`}
              className="w-full flex-shrink-0 snap-center h-72 sm:h-[26rem] object-cover"
            />
          ))}
        </div>

        <div
          className="absolute left-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold text-white"
          style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(26,26,26,0.6)", backdropFilter: "blur(6px)" }}
        >
          <Star size={14} style={{ color: LIME }} fill={LIME} />
          {selectedTurf.rating}
          {selectedTurf.reviews ? (
            <span className="text-gray-300 font-normal">({selectedTurf.reviews} reviews)</span>
          ) : null}
        </div>

        {gallery.length > 1 && (
          <div
            className="absolute right-3 bottom-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "rgba(26,26,26,0.6)", backdropFilter: "blur(6px)" }}
          >
            {activeImage + 1} / {gallery.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip — tap to jump the gallery to that photo */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-3">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollToImage(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden border-2 focus-visible:outline-none"
              style={{ borderColor: activeImage === i ? LIME : "transparent" }}
              aria-label={`Show photo ${i + 1}`}
            >
              <img src={src} alt="" className="w-20 h-14 object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Title block */}
        <div className="mt-2">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
            style={{ backgroundColor: "rgba(180,231,22,0.1)", color: LIME }}
          >
            <ShieldCheck size={13} />
            Verified turf
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {selectedTurf.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin size={14} style={{ color: LIME }} />
            {selectedTurf.location}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full border text-gray-300"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              Football
            </span>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full border text-gray-300"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              5v5, 7v7
            </span>
          </div>
        </div>

        {/* About */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-white mb-2">About turf</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Premium hybrid turf with professional floodlights and
            well-maintained grass. Suitable for 5-a-side and 7-a-side
            matches. Popular for evening matches and training sessions.
          </p>
        </div>

        {/* Amenities */}
        <div
          className="mt-6 rounded-2xl p-5 border"
          style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#1f1f1f" }}
        >
          <h3 className="font-bold text-white mb-4">Amenities</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center text-center gap-2 p-3 rounded-xl border"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: INK }}
              >
                <Icon size={20} style={{ color: LIME }} />
                <span className="text-xs text-gray-300 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date & time */}
        <div
          className="mt-6 rounded-2xl p-5 border"
          style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#1f1f1f" }}
        >
          <h3 className="font-bold text-white mb-4">Select date &amp; time</h3>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4">
            {days.map((d) => {
              const active = isSameDay(d, selectedDate);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelectedDate(d)}
                  className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-semibold focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    borderColor: active ? LIME : "rgba(255,255,255,0.12)",
                    color: active ? LIME : "#E5E5E0",
                    backgroundColor: active ? "rgba(180,231,22,0.08)" : "transparent",
                    outlineColor: LIME,
                  }}
                >
                  <span>{isSameDay(d, days[0]) ? "Today" : dayLabel(d)}</span>
                  <span className="text-xs font-normal text-gray-500">{dateLabel(d)}</span>
                </button>
              );
            })}
            <button
              onClick={() => setShowCalendar(true)}
              className="flex-shrink-0 p-3 rounded-xl border focus-visible:outline-none focus-visible:ring-2"
              style={{ borderColor: "rgba(255,255,255,0.12)", outlineColor: LIME }}
              aria-label="Open calendar"
            >
              <CalendarIcon size={18} style={{ color: LIME }} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LIME }} />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#4a4a4a" }} />
              Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7a3b3b" }} />
              Unavailable
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const style = statusStyle[slot.status];
              return (
                <motion.button
                  key={slot.id}
                  onClick={() => selectSlot(slot)}
                  whileTap={{ scale: slot.status === "available" ? 0.96 : 1 }}
                  disabled={slot.status !== "available"}
                  className="relative text-xs font-semibold p-2.5 rounded-xl border leading-snug focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    borderColor: isSelected ? LIME : style.border,
                    backgroundColor: isSelected ? LIME : style.bg,
                    color: isSelected ? INK : style.text,
                    cursor: slot.status === "available" ? "pointer" : "not-allowed",
                    outlineColor: LIME,
                  }}
                >
                  {slot.popular && !isSelected && (
                    <span
                      className="absolute -top-2 right-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: LIME, color: INK }}
                    >
                      Popular
                    </span>
                  )}
                  <div>{slot.time}</div>
                  <div className="opacity-70 font-normal">– {slot.end}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed booking bar — always visible on every screen size, never requires scrolling */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(26,26,26,0.97)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xl font-black text-white leading-none">
              ₹{selectedTurf.price}
              <span className="text-sm text-gray-400 font-medium">/hour</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {activeSlot ? `${activeSlot.time} – ${activeSlot.end} · Incl. of all taxes` : "Incl. of all taxes"}
            </div>
          </div>
          <button
            onClick={() => alert("Open directions in maps - replace with actual link")}
            className="shrink-0 p-3.5 rounded-xl border text-white focus-visible:outline-none focus-visible:ring-2"
            style={{ borderColor: "rgba(255,255,255,0.15)", outlineColor: LIME }}
            aria-label="Get directions"
          >
            <MapPin size={18} style={{ color: LIME }} />
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            disabled={!selectedSlotId}
            className="shrink-0 px-5 sm:px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: selectedSlotId ? LIME : "#333333",
              color: selectedSlotId ? INK : "#8A8A8A",
              cursor: selectedSlotId ? "pointer" : "not-allowed",
              outlineColor: LIME,
            }}
          >
            Continue to book
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar popover */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              onClick={() => setShowCalendar(false)}
            />
            <motion.div
              initial={{ scale: 0.97, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 20, opacity: 0 }}
              className="relative rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-sm border"
              style={{ backgroundColor: "#1f1f1f", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close calendar"
              >
                <X size={18} />
              </button>
              <Calendar
                className="turf-calendar"
                value={selectedDate}
                onChange={(d) => {
                  setSelectedDate(d);
                  setShowCalendar(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              onClick={() => setShowBookingModal(false)}
            />
            <motion.div
              initial={{ scale: 0.97, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 20, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md border"
              style={{ backgroundColor: "#1f1f1f", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(180,231,22,0.12)", color: LIME }}
              >
                Confirm reservation
              </div>

              <p className="text-gray-300 mb-1">
                You're booking{" "}
                <span className="font-semibold text-white">
                  {activeSlot?.time} – {activeSlot?.end}
                </span>
              </p>
              <p className="text-gray-300 mb-5">
                on{" "}
                <span className="font-semibold text-white">{selectedDate.toDateString()}</span>{" "}
                at <span className="font-semibold text-white">{selectedTurf.name}</span>
              </p>

              <div
                className="flex items-center justify-between rounded-xl p-3 mb-5 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: INK }}
              >
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-lg font-black" style={{ color: LIME }}>
                  ₹{selectedTurf.price}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmReservation}
                  className="flex-1 py-3 rounded-xl font-bold active:scale-95 transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: LIME, color: INK }}
                >
                  Pay &amp; confirm
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 rounded-xl border text-white active:scale-95 transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
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