import React from "react";
import { useTaskContext, TaskStatus } from "../../Context/TaskContext.tsx";
import {
  BarChart,
  Bar,
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

const ChartContainer = () => {
  const { tasks } = useTaskContext();

  // Calculate total time spent and total estimated time
  const totalTimeSpent = tasks.reduce(
    (acc, task) => acc + task.progressTime,
    0
  );
  const totalEstimatedTime = tasks.reduce(
    (acc, task) => acc + (task.end.getTime() - task.start.getTime()) / 1000,
    0
  );

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="mb-8 flex gap-4">
      <div className="p-4 rounded-xl border shadow">
        <h3 className="text-xl font-semibold mb-2">
          Total Tasks of Each Status
        </h3>
        <div className="w-full">
          {/* Wrap the chart in ResponsiveContainer */}
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
                dataKey="count">
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
          {/* Wrap the chart in ResponsiveContainer */}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
