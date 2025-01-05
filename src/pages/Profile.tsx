import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const Profile: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is authenticated
      } else {
        navigate("/signin");
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="rounded-full overflow-hidden h-40 w-40 border-4 border-blue-600">
            <img
              className="object-cover w-full h-full"
              src={user?.photoURL ?? "https://placehold.co/400"}
              alt="User avatar"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {user?.displayName ?? "User"}
          </h1>
          <p className="text-gray-500">
            {user?.email ?? "Email not available"}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* Profile Details */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Full Name:</span>
            <span className="text-gray-800">{user?.displayName ?? "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{user?.email ?? "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Phone:</span>
            <span className="text-gray-800">
              {user?.phoneNumber ?? "Not Provided"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none"
            onClick={() => {
              auth.signOut();
              window.location.reload(); // Reload to ensure logout
            }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
