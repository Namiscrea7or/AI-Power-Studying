import React from "react";
import Info from "./Info.tsx";
import ChartContainer from "./ChartContainer.tsx";

const Analytics: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <Info />
      <ChartContainer />
    </div>
  );
};

export default Analytics;
