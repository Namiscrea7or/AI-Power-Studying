import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">MyApp</Link>
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
        <div className="hidden md:flex space-x-6">
          <Link to="/signin" className="text-gray-700 hover:text-blue-600">
            Sign In
          </Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-600">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
