import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    Cookies.remove("auth_token");

    navigate("/signin");
  };

  return (
    <div>
      <h1>Welcome to Your Profile</h1>
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300">
        Logout
      </button>
    </div>
  )
}

export default Profile