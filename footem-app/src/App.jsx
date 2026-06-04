import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Signup from "./Pages/SignUp";
import TurfDetails from "./Pages/TurfDetails";
import MyBookings from "./Pages/MyBookings";
import Dashboard from "./Pages/Dashboard";
import Turf from "./Pages/Turfs";
import Profile from "./Pages/Profile/Profile.jsx";
import ApplyForOwner from "./Pages/ApplyForOwner.jsx";
import OwnerProfile from "./Pages/OwnerProfile.jsx";
import OwnerDashboard from "./Pages/OwnerDashboard.jsx";
import { TurfProvider } from "./context/TurfContext";
import { BookingProvider } from "./context/BookingContext";
import { OwnerProvider } from "./context/OwnerContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
    <ToastContainer />
      <TurfProvider>
        <BookingProvider>
          <OwnerProvider>
            <div className="App">
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/turf/:id" element={<TurfDetails />} />
                  <Route path="/mybookings" element={<MyBookings />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/turfs" element={<Turf />} />
                  <Route path ="/profile" element={<Profile/>} />
                  <Route path="/apply-owner" element={<ApplyForOwner />} />
                  <Route path="/owner-profile" element={<OwnerProfile />} />
                  <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                </Routes>
              </Router>
            </div>
          </OwnerProvider>
        </BookingProvider>
      </TurfProvider>
    </>
  );
}

export default App;
