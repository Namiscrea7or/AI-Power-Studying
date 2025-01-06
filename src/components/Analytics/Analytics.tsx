import React, { useEffect, useState } from "react";
import Info from "./Info.tsx";
import ChartContainer from "./ChartContainer.tsx";
import { getAnalyticsSummary } from "../../services/TaskServices.ts";

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalyticsSummary = async () => {
      try {
        const data = await getAnalyticsSummary();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics summary:", error);
      }
    };

    fetchAnalyticsSummary();
  }, []);

  if (!analyticsData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <Info data={analyticsData} />
      <ChartContainer data={analyticsData} />
    </div>
  );
};

export default Analytics;