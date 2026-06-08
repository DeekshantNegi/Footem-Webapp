import { useState, useContext } from "react";
import Card from "../Components/Card";
import turfdata from "../data/turf";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import NoDatagif from "../assets/Nodatagif.json";
import { TurfContext } from "../context/TurfContext";

const Turfs = () => {
  const navigate = useNavigate();
  const { handleSelectedTurf } = useContext(TurfContext);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [maxprice, setMaxprice] = useState(3000);
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    sports: [],
    price: 3000,
    location: "",
  });

  const handleApplyFilters = () => {
    setAppliedFilters({ sports: selectedSports, price: maxprice, location: locationFilter });
    setShowFilters(false);
  };

  const handleSportChange = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const filteredTurfs = turfdata.filter((turf) => {
    const matchesSport =
      appliedFilters.sports.length === 0 || appliedFilters.sports.includes(turf.sport);
    const matchesPrice = turf.price <= appliedFilters.price;
    const matchesLocation = turf.location
      .toLowerCase()
      .includes(appliedFilters.location.toLowerCase());
    return matchesSport && matchesPrice && matchesLocation;
  });

  const activeFilterCount =
    (appliedFilters.sports.length > 0 ? 1 : 0) +
    (appliedFilters.price < 3000 ? 1 : 0) +
    (appliedFilters.location ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-12">

      {/* ── Page Header ── */}
      <div className="px-6 mb-8">
        <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-1">
          Explore
        </p>
        <h1 className="text-white text-3xl font-bold mb-1">Find Your Perfect Turf</h1>
        <p className="text-gray-500 text-sm">Showing the best turfs available near you</p>
        <div className="w-12 h-[3px] bg-[#c8f028] mt-3 rounded-full" />
      </div>

      <div className="px-6 flex flex-col md:flex-row gap-6">

        {/* ── Mobile Filter Toggle ── */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#1e1e1e] border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg hover:border-[#c8f028]/40 transition-all"
          >
            <span>⚙️</span> Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#c8f028] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <span className="text-gray-500 text-xs">{filteredTurfs.length} results</span>
          )}
        </div>

        {/* ── Filter Sidebar ── */}
        <AnimatePresence>
          {(showFilters || typeof window !== "undefined" && window.innerWidth >= 768) && (
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full md:w-64 flex-shrink-0"
            >
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-base">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedSports([]);
                        setMaxprice(3000);
                        setLocationFilter("");
                        setAppliedFilters({ sports: [], price: 3000, location: "" });
                      }}
                      className="text-[#c8f028] text-xs hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                    Location
                  </label>
                  <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 focus-within:border-[#c8f028]/50 transition-all">
                    <span className="text-gray-500 text-sm">📍</span>
                    <input
                      type="text"
                      value={locationFilter}
                      placeholder="City, area or turf name"
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-transparent text-white text-sm focus:outline-none w-full placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Sport Type */}
                <div className="flex flex-col gap-3">
                  <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                    Sport Type
                  </label>
                  {["football", "cricket"].map((sport) => (
                    <label key={sport} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => handleSportChange(sport)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          selectedSports.includes(sport)
                            ? "bg-[#c8f028] border-[#c8f028]"
                            : "border-white/20 group-hover:border-[#c8f028]/50"
                        }`}
                      >
                        {selectedSports.includes(sport) && (
                          <span className="text-black text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <span className="text-gray-300 text-sm capitalize">{sport}</span>
                    </label>
                  ))}
                </div>

                {/* Price Range */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                      Max Price
                    </label>
                    <span className="text-[#c8f028] text-sm font-bold">₹{maxprice}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="500"
                    value={maxprice}
                    onChange={(e) => setMaxprice(e.target.value)}
                    className="w-full accent-[#c8f028] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>₹500</span>
                    <span>₹5000</span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-[#c8f028] text-black font-bold py-2.5 rounded-lg hover:brightness-110 transition-all duration-200 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Turf Grid ── */}
        <div className="flex-1">

          {/* Results count */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <p className="text-gray-500 text-sm">
              <span className="text-white font-semibold">{filteredTurfs.length}</span> turfs found
            </p>
          </div>

          {filteredTurfs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTurfs.map((turf) => (
                <Card
                  key={turf.id}
                  turf={turf}
                  onClick={() => (handleSelectedTurf(turf), navigate(`/turf/${turf.id}`))}
                />
              ))}
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
              <Lottie animationData={NoDatagif} loop={true} className="w-52 h-52 opacity-80" />
              <h3 className="text-white font-semibold text-lg">No Turfs Found</h3>
              <p className="text-gray-500 text-sm text-center max-w-xs">
                No turfs match your current filters. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSelectedSports([]);
                  setMaxprice(3000);
                  setLocationFilter("");
                  setAppliedFilters({ sports: [], price: 3000, location: "" });
                }}
                className="mt-2 bg-[#c8f028] text-black text-sm font-bold px-5 py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Turfs;