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
    setAppliedFilters({
      sports: selectedSports,
      price: maxprice,
      location: locationFilter,
    });
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleSportChange = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };
  const handlePriceChange = (e) => {
    setMaxprice(e.target.value);
  };

  const filteredTurfs = turfdata.filter((turf) => {
    const matchesSport =
      appliedFilters.sports.length === 0 ||
      appliedFilters.sports.includes(turf.sport);
    const matchesPrice = turf.price <= appliedFilters.price;
    const matchesLocation = turf.location
      .toLowerCase()
      .includes(appliedFilters.location.toLowerCase());
    return matchesSport && matchesPrice && matchesLocation;
  });

  return (
    <div className="relative w-full min-h-screen  ">
      <div className="w-full p-[2vmin] ">
        <h1 className="text-2xl sm:text-[5vmin] font-bold  ">
          Find Your Perfect Turf
        </h1>
        <h2 className="text-md leading-3 sm:leading-none ">
          Showing some of the best turfs available
        </h2>
      </div>

      <div className=" w-full h-full flex flex-col md:flex-row justify-center  ">
        {/*Filter*/}
        <button
          className="md:hidden w-[70px] ml-[1vmin] text-white font-semibold bg-green-500 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.01] active:scale-110 active:bg-green-300 cursor-pointer"
          onClick={() => {
            setShowFilters(!showFilters);
          }}
        >
          Filter
        </button>

        <AnimatePresence>
          {(showFilters || window.innerWidth >= 768) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-[20%] h-full rounded-2xl shadow-2xl p-[1vmin] overflow-hidden md:opacity-100 "
            >
              <aside className=" ">
                <h2 className="text-[2vmax] md:text-[2vmin] font-bold">
                  Filter
                </h2>

                <div className="flex flex-col md:text-[2vmin] text-black/70 font-semibold space-y-[1vmin]">
                  <div className="flex flex-col rounded-lg sm:flex-row sm:items-center gap-[1vmin] p-[1vmin] w-full text-black/50">
                    <label for="location-input">Location</label>
                    <input
                      className="w-full border border-gray-300 text-sm rounded-md p-1 focus:outline-none"
                      type="text"
                      id="location-input"
                      value={locationFilter}
                      placeholder="City, Area, or Turf Name"
                      onChange={handleLocationChange}
                    ></input>
                  </div>

                  <div className="flex flex-col space-y-2 rounded-xl shadow-xl p-[1vmin] ">
                    <h3>Sport Type</h3>
                    <label className="cursor-pointer flex gap-1">
                      <input
                        type="checkbox"
                        name="sport"
                        onChange={() => handleSportChange("football")}
                      />
                      <span className="text-black/50">Football</span>
                    </label>
                    <label className="cursor-pointer flex gap-1">
                      <input
                        type="checkbox"
                        name="sport"
                        onChange={() => handleSportChange("cricket")}
                      />

                      <span className="text-black/50">Cricket</span>
                    </label>
                  </div>

                  <div className="rounded-xl p-[1vmin] shadow-xl">
                    <label for="price-range">Price Range</label>

                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={maxprice}
                      onChange={handlePriceChange}
                      className="w-full accent-green-500 cursor-pointer"
                    />

                    <div className="text-sm text-gray-400">
                      $<span id="min-price">500</span> - $
                      <span id="max-price">{maxprice}</span> per hour
                    </div>
                  </div>

                  <button
                    id="apply-filters-btn"
                    className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg 
                   hover:bg-green-500 transition duration-200 transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                    onClick={handleApplyFilters}
                  >
                    APPLY FILTERS
                  </button>
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className=" w-full md:w-[75%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 shadow-lg overflow-hidden rounded-2xl   ">
          {filteredTurfs.length > 0 ? (
            filteredTurfs.map((turf) => (
              <Card
                key={turf.id}
                turf={turf}
                onClick={() => (
                  handleSelectedTurf(turf), navigate(`/turf/${turf.id}`)
                )}
              />
            ))
          ) : (
            <div className="flex items-center justify-center col-span-full  ">
              <p className="text-gray-500 w-full h-full mt-2 flex justify-center items-center text-center">
                No turfs match your filters{" "}
                <Lottie
                  animationData={NoDatagif}
                  loop={true}
                  className="w-[300px] h-[300px]"
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Turfs;
