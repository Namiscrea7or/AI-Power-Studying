import React, { useState } from "react";
import SideMenu from "../components/Navigation/SideMenu.tsx";
import CalendarView from "../components/Calendar/CalendarView.tsx";
import TaskView from "../components/TaskView/TaskView.tsx";
import Analytics from "../components/Analytics/Analytics.tsx";
import { TaskProvider } from "../Context/TaskContext.tsx";
import { Navigate } from "react-router-dom";
import HoverAIButton from "../components/AI/ButtonAI.tsx";
import { auth } from "../firebase/firebase.config.js";

const MainPage: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("tasks");

  const user = auth.currentUser;
  if (!user) {
    return <Navigate to={"/signin"} replace />;
  }

  const views: { [key: string]: JSX.Element } = {
    tasks: <TaskView />,
    calendar: <CalendarView />,
    analytics: <Analytics />,
    // settings: <Settings />,
  };

  return (
    <div className="flex relative">
      <TaskProvider>
        <SideMenu setActiveView={setActiveView} defaultActiveKey="tasks" />
        <div className="lg:ml-[20%] p-8 flex-grow">
          {views[activeView] || <p>View not found</p>}
        </div>
        <HoverAIButton isAnalytics={activeView === "analytics"} />
      </TaskProvider>
    </div>
  );
};

export default MainPage;
