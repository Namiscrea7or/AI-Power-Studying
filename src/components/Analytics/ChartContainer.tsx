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

const ChartContainer: React.FC<ChartContainerProps> = ({ data }) => {
  const { dailyTimeSpent, taskStatusSummary } = data;
  const taskStatusData = Object.keys(taskStatusSummary).map((status) => ({
    status,
    count: taskStatusSummary[status],
  }));

  return (
    <div className="mb-8 flex gap-4">
      <div className="p-4 rounded-xl border shadow">
        <h3 className="text-xl font-semibold mb-2">Total Tasks of Each Status</h3>
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