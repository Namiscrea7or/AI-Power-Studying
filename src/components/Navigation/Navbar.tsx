import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [auth]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    signOut(auth);
    navigate("/signin");
  };

  return (
    <nav className="sticky shadow bg-white top-0 z-50 border-b">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Power Study</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          {!currentUser ? (
            <>
              <Link to="/signin" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                onClick={toggleDropdown}>
                <span>My Account</span>
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {!currentUser ? (
            <>
              <Link
                to="/signin"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={toggleMenu}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={toggleMenu}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={toggleMenu}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
