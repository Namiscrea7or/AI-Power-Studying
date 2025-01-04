import React from 'react';
import { useTaskContext, TaskStatus } from "../../Context/TaskContext.tsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const { tasks } = useTaskContext();

  // Calculate total time spent and total estimated time
  const totalTimeSpent = tasks.reduce((acc, task) => acc + task.progressTime, 0);
  const totalEstimatedTime = tasks.reduce((acc, task) => acc + (task.end.getTime() - task.start.getTime()) / 1000, 0);

  // Calculate total time spent daily
  const dailyTimeSpent = tasks.reduce((acc, task) => {
    const date = task.start.toLocaleDateString();
    acc[date] = (acc[date] || 0) + task.progressTime;
    return acc;
  }, {} as Record<string, number>);

  const dailyTimeSpentData = Object.keys(dailyTimeSpent).map(date => ({
    date,
    timeSpent: dailyTimeSpent[date] / 3600, // Convert to hours
  }));

  // Calculate total tasks of each status
  const taskStatusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskStatusData = Object.keys(taskStatusCount).map(status => ({
    status,
    count: taskStatusCount[status],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Total Time Spent vs. Total Estimated Time</h3>
        <BarChart width={600} height={300} data={[
          { name: 'Total Time Spent', value: totalTimeSpent / 3600 },
          { name: 'Total Estimated Time', value: totalEstimatedTime / 3600 },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Total Time Spent Daily</h3>
        <BarChart width={600} height={300} data={dailyTimeSpentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="timeSpent" fill="#82ca9d" />
        </BarChart>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Total Tasks of Each Status</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={taskStatusData}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {taskStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Analytics;