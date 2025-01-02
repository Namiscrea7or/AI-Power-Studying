import React, { useState, useEffect } from "react";
import { Task } from "../../Context/TaskContext.tsx";

interface TimerPopupProps {
  task: Task;
  onClose: () => void;
  updateTask: (updatedTask: Task) => void;
}

const TimerPopup: React.FC<TimerPopupProps> = ({ task, onClose, updateTask }) => {
  const [isWork, setIsWork] = useState(true);
  const [workTime, setWorkTime] = useState(1500); // 25 minutes
  const [breakTime, setBreakTime] = useState(300); // 5 minutes
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            if (isWork) {
              setIsWork(false);
              return breakTime;
            } else {
              setIsWork(true);
              return workTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isWork, breakTime, workTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStart = () => {
    if (!timer) {
      setTimer(setTimeout(() => {}, 0)); // Dummy timeout to trigger useEffect
    }
  };

  const handlePause = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleReset = () => {
    handlePause();
    setWorkTime(1500);
    setBreakTime(300);
    setIsWork(true);
    setTimeLeft(1500);
  };

  const handleClose = () => {
    handlePause();
    updateTask({ ...task, progressTime: task.progressTime + (1500 - timeLeft) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">Focus Timer</h2>
        <div className="text-center mb-4">
          <p className="text-xl font-bold">{isWork ? "Work Time" : "Break Time"}</p>
          <p className="text-4xl font-mono">{formatTime(timeLeft)}</p>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          {/* <p className="text-sm text-gray-600">Progress Time: {formatTime(task.progressTime)}</p> */}
        </div>
        <div className="flex justify-around mb-4">
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start
          </button>
          <button
            onClick={handlePause}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPopup;