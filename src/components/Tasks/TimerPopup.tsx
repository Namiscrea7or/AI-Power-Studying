import React, { useState } from "react";

interface TimerPopupProps {
  onClose: () => void;
}

const TimerPopup: React.FC<TimerPopupProps> = ({ onClose }) => {
  const [time, setTime] = useState(0);

  const handleStart = () => {

  };

  const handleStop = () => {

  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Focus Timer</h2>
        <div className="mb-4">
          <span className="text-2xl">{time} seconds</span>
        </div>
        <div className="flex justify-between">
          <button onClick={handleStart} className="bg-green-500 text-white px-4 py-2 rounded">
            Start
          </button>
          <button onClick={handleStop} className="bg-red-500 text-white px-4 py-2 rounded">
            Stop
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPopup;