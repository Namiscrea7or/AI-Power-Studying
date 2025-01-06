import React, { useState } from "react";

interface InfoProps {
  data: {
    totalTimeSummary: {
      totalTimeSpent: number;
      totalEstimatedTime: number;
    };
    taskStatusSummary: {
      todo: number;
      inProgress: number;
      completed: number;
      expired: number;
    };
  };
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const { totalTimeSummary, taskStatusSummary } = data;
  const totalTasks =
    taskStatusSummary.todo +
    taskStatusSummary.inProgress +
    taskStatusSummary.completed +
    taskStatusSummary.expired;

  const [timeFormat, setTimeFormat] = useState<"hours" | "minutes" | "seconds">(
    "hours"
  );

  const formatTime = (time: number) => {
    switch (timeFormat) {
      case "minutes":
        return (time * 60).toFixed(2);
      case "seconds":
        return (time * 3600).toFixed(2);
      case "hours":
      default:
        return time.toFixed(2);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Time spent / Estimated time</div>
          <select
            value={timeFormat}
            onChange={(e) =>
              setTimeFormat(e.target.value as "hours" | "minutes" | "seconds")
            }
            className="ml-2 p-1 border rounded">
            <option value="hours">Hours</option>
            <option value="minutes">Minutes</option>
            <option value="seconds">Seconds</option>
          </select>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            {formatTime(totalTimeSummary.totalTimeSpent)}/
            {formatTime(totalTimeSummary.totalEstimatedTime)} {timeFormat}
          </div>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Time spent daily</div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            {formatTime(totalTimeSummary.totalTimeSpent)} {timeFormat}
          </div>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Total tasks</div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalTasks} tasks</div>
        </div>
      </div>
    </div>
  );
};

export default Info;
