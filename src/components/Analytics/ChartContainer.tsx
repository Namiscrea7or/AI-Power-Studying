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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ChartContainerProps {
  data: {
    dailyTimeSpent: { date: string; timeSpent: number }[];
    taskStatusSummary: {
      todo: number;
      inProgress: number;
      completed: number;
      expired: number;
    };
  };
}

const mockData = {
  dailyTimeSpent: [
    { date: "2023-01-01", timeSpent: 2 },
    { date: "2023-01-02", timeSpent: 3 },
    { date: "2023-01-03", timeSpent: 1.5 },
    { date: "2023-01-04", timeSpent: 4 },
    { date: "2023-01-05", timeSpent: 2.5 },
  ],
  taskStatusSummary: {
    todo: 5,
    inProgress: 3,
    completed: 8,
    expired: 1,
  },
};

const ChartContainer: React.FC<ChartContainerProps> = ({ data }) => {
  const { dailyTimeSpent, taskStatusSummary } = mockData;
  const taskStatusData = Object.keys(taskStatusSummary).map((status) => ({
    status,
    count: taskStatusSummary[status],
  }));

  return (
    <div className="mb-8 flex flex-col lg:flex-row gap-4">
      <div className="p-4 rounded-xl border shadow flex-grow">
        <h3 className="text-xl font-semibold mb-2">Total Tasks of Each Status</h3>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={350}>
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
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyTimeSpent}>
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