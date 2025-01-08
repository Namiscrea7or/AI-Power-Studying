import React, { useState, useEffect } from "react";
import { Task } from "../../Context/TaskContext.tsx";
import {
  createTimerSession,
  updateTimerSession,
  getTimerSessions,
} from "../../services/TaskServices.ts";

interface TimerPopupProps {
  task: Task;
  onClose: () => void;
  updateTask: (updatedTask: Task) => void;
}

const TimerPopup: React.FC<TimerPopupProps> = ({
  task,
  onClose,
  updateTask,
}) => {
  const [isWork, setIsWork] = useState(true);
  const [workTime, setWorkTime] = useState(1500); // Default 25 minutes
  const [breakTime, setBreakTime] = useState(300); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  useEffect(() => {
    setTimeLeft(workTime);
  }, [workTime]);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            setShowNotification(true);
            return isWork ? breakTime : workTime;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isWork, breakTime, workTime]);

  useEffect(() => {
    const checkRunningSession = async () => {
      try {
        const sessions = await getTimerSessions(task.id);
        const runningSession = sessions.find(
          (session: any) => session.timerState === 0
        );
        if (runningSession) {
          setIsSessionRunning(true);
          setCurrentSessionId(runningSession.id);
        }
      } catch (error) {
        console.error("Error checking running session:", error);
      }
    };

    checkRunningSession();
  }, [task.id]);

  useEffect(() => {
    const storedSession = localStorage.getItem("runningSession");
    if (storedSession) {
      const session = JSON.parse(storedSession);
      if (session.taskId === task.id) {
        setIsSessionRunning(true);
        setCurrentSessionId(session.id);
      }
    }
  }, [task.id]);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (timer) {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome to trigger the confirmation dialog
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStart = async () => {
    const storedSession = localStorage.getItem("runningSession");
    if (storedSession && !isPaused) {
      alert(
        "A session is already running. Please close the other session first."
      );
      return;
    }

    if (!timer) {
      setTimer(setTimeout(() => {}, 0)); // Dummy timeout to trigger useEffect
      setIsSessionRunning(true);

      try {
        const sessionData = {
          id: 0,
          duration: 0,
          timerType: isWork ? 0 : 1, // 0 for work, 1 for break
          timerState: 0,
          studyTaskId: task.id,
        };

        console.log("Creating new session:", sessionData);
        const newSession = await createTimerSession(sessionData);
        console.log("New session created:", newSession);

        if (newSession) {
          setCurrentSessionId(newSession.id);
          localStorage.setItem(
            "runningSession",
            JSON.stringify({ id: newSession.id, taskId: task.id })
          );
        }
      } catch (error) {
        console.error("Error creating timer session:", error);
      }
    }
  };

  const handlePause = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    handlePause();
    setTimeLeft(workTime);
    setIsWork(true);
  };

  const handleClose = async () => {
    if (currentSessionId) {
      try {
        await updateTimerSession({
          id: currentSessionId,
          duration: workTime - timeLeft,
          timerType: isWork ? 0 : 1, // 0 for work, 1 for break
          timerState: 1,
          studyTaskId: task.id,
        });
        alert("Session ended successfully!");
      } catch (error) {
        console.error("Error updating timer session:", error);
      }
      localStorage.removeItem("runningSession");
    }

    onClose();
  };

  const handleContinue = () => {
    setIsWork(true);
    setTimeLeft(workTime);
    setShowNotification(false);
    handleStart();
  };

  const handleBreak = () => {
    handlePause();
    setIsWork(false);
    setTimeLeft(breakTime);
    setShowNotification(false);
    setTimer(setTimeout(() => {}, 0)); // Dummy timeout to trigger useEffect
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">Focus Timer</h2>
        <div className="text-center mb-4">
          <p className="text-xl font-bold">
            {isWork ? "Work Time" : "Break Time"}
          </p>
          <p className="text-4xl font-mono">{formatTime(timeLeft)}</p>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="flex justify-around mb-4">
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded">
            Start
          </button>
          <button
            onClick={handlePause}
            className="bg-red-500 text-white px-4 py-2 rounded">
            Pause
          </button>
          <button
            onClick={handleReset}
            className="bg-yellow-500 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
        <div className="text-center mb-4">
          <label className="block mb-2">
            Work Time (minutes):
            <input
              type="number"
              value={workTime / 60}
              onChange={(e) => setWorkTime(Number(e.target.value) * 60)}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <label className="block mb-2">
            Break Time (minutes):
            <input
              type="number"
              value={breakTime / 60}
              onChange={(e) => setBreakTime(Number(e.target.value) * 60)}
              className="ml-2 p-1 border rounded"
            />
          </label>
        </div>
        <div className="text-center">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
      {showNotification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Session Ended
            </h2>
            <div className="text-center mb-4">
              <p className="text-xl font-bold">
                What would you like to do next?
              </p>
            </div>
            <div className="flex justify-around mb-4">
              <button
                onClick={handleContinue}
                className="bg-green-500 text-white px-4 py-2 rounded">
                Continue Focus
              </button>
              <button
                onClick={handleBreak}
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Take a Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerPopup;