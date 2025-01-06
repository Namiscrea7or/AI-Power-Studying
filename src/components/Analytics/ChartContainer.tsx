import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Mock data for tasks
const tasks = [
  { id: 1, title: "Task 1", start: new Date("2023-01-01"), progressTime: 3600, status: "Completed" },
  { id: 2, title: "Task 2", start: new Date("2023-01-02"), progressTime: 7200, status: "In Progress" },
  { id: 3, title: "Task 3", start: new Date("2023-01-03"), progressTime: 1800, status: "Pending" },
  { id: 4, title: "Task 4", start: new Date("2023-01-04"), progressTime: 5400, status: "Completed" },
  { id: 5, title: "Task 5", start: new Date("2023-01-05"), progressTime: 3600, status: "Failed" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartContainer = () => {
  // Calculate total time spent daily
  const dailyTimeSpent = tasks.reduce((acc, task) => {
    const date = task.start.toLocaleDateString();
    acc[date] = (acc[date] || 0) + task.progressTime;
    return acc;
  }, {} as Record<string, number>);

  const dailyTimeSpentData = Object.keys(dailyTimeSpent).map((date) => ({
    date,
    timeSpent: dailyTimeSpent[date] / 3600, // Convert to hours
  }));

  // Calculate total tasks of each status
  const taskStatusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskStatusData = Object.keys(taskStatusCount).map((status) => ({
    status,
    count: taskStatusCount[status],
  }));

  return (
    <div className="mb-8 flex gap-4">
      <div className="p-4 rounded-xl border shadow">
        <h3 className="text-xl font-semibold mb-2">
          Total Tasks of Each Status
        </h3>
        <div className="w-full">
          <ResponsiveContainer minWidth={400} width="100%" height={350}>
            <PieChart>
              <Pie
                outerRadius={80}
                width="100%"
                data={taskStatusData}
                cx="50%" // Center horizontally
                cy="50%" // Center vertically
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                fill="#8884d8"
                dataKey="count"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-4 rounded-xl border shadow flex-grow">
        <h3 className="text-xl font-semibold mb-2">User Progress</h3>
        <div className="w-full">
          <ResponsiveContainer minWidth={400} width="100%" height={350}>
            <LineChart data={dailyTimeSpentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="timeSpent" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;