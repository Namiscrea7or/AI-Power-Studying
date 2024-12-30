import { IoIosClose } from "react-icons/io";
import React, { useState, useEffect } from "react";

const ModalAI = ({ content, onClose }) => {
  const [isContentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="flex flex-col bg-white h-2/3 overflow-y-auto p-6 rounded-lg shadow-lg w-2/3 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">AI Modal</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}>
            <IoIosClose className="w-6 h-6" />
          </button>
        </div>
        {/* Show loading spinner or placeholder until content is ready */}
        <div className="flex-grow flex items-center justify-center">
          {isContentLoaded ? (
            content || "Content loaded!"
          ) : (
            <div className="text-center">
              <div className="loader border-t-blue-500 border-4 w-8 h-8 mx-auto animate-spin rounded-full"></div>
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAI;
