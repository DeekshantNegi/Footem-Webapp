import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Form, useNavigate } from "react-router-dom";
import DefaultPic from "../../assets/nagi.jpeg";

export default function ProfilePage() {
  const [openEdit, setOpenEdit]= useState(false);
  const { user } = useContext(AuthContext);
  const [formdata, setFormdata] = useState({
    fullName:"",
    email:"",
    phone:""
  });

  const handleChange=(e)=>{
    setFormdata(prev=>({...prev, [e.target.name]: e.target.value}));
  }
  const handlesubmit=(e)=>{
    e.preventDefault();
    // Handle form submission logic here
    
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 👤 PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <img
            src={user?.avatar?.url || DefaultPic}
            alt="avatar"
            className="w-30 h-30 rounded-full object-cover border"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{user?.fullName || "User Name"}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {user?.phone || "No phone added"}
            </p>
          </div>

          <button onClick={()=>{setOpenEdit(prev=> !prev)}} className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 active:scale-95 transition">
            Edit Profile
          </button>
        </div>

        {openEdit && 
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <p className="text-gray-500">Update your profile information here.</p>
            <Form onSubmit={handlesubmit}>
              <input type="text" name="fullName" placeholder="Full Name" value={formdata.fullName} onChange={(e)=>handleChange(e)}/>
              <input type="email" name="email" placeholder="Email" value={formdata.email} onChange={(e)=>handleChange(e)}/>
              <input type="phone" name="phone" placeholder="phone no." value={formdata.phone} onChange={(e)=>handleChange(e)}/>
              <button type="submit">
                Submit
              </button>
              
            
            </Form>
          </div>
        }

        {/* 📊 STATS CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h3 className="text-2xl font-bold text-green-600">12</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Upcoming Matches</p>
            <h3 className="text-2xl font-bold text-green-600">2</h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Favorites</p>
            <h3 className="text-2xl font-bold text-green-600">5</h3>
          </div>
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              View My Bookings
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Explore Turfs
            </button>
          </div>
        </div>

        {/* 🕒 RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <ul className="space-y-3 text-gray-600 text-sm">
            <li>⚽ Booked "Green Turf Arena"</li>
            <li>❌ Cancelled a booking</li>
            <li>❤️ Added "City Sports Ground" to favorites</li>
          </ul>
        </div>

        {/* ⚙️ SETTINGS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
              Change Password
            </button>

            <button className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

 