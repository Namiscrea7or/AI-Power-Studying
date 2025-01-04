import React from "react";
import Info from "./Info.jsx";
import ChartContainer from "./ChartContainer.tsx";
import HoverAIButton from "../AI/ButtonAI.tsx";

const Analytics: React.FC = () => {
  return (
    <div className="relative">
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <Info />
      <ChartContainer />
      <HoverAIButton isAnalytics />
    </div>
  );
};

export default Analytics;
