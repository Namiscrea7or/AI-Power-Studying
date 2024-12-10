import React from "react";
import { useState } from "react";
import SideMenu from "../components/SideMenu.tsx";
import TaskList from "../components/TaskList.tsx";
import CalendarView from "../components/CalendarView.tsx";
import TaskView from "../components/TaskView.tsx";

const MainPage: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("tasks");

  const views: { [key: string]: JSX.Element } = {
    tasks: <TaskView />,
    calendar: <CalendarView />,
    // analytics: <Analytics />,
    // settings: <Settings />,
  };

  return (
    <div className="flex relative">
      <SideMenu setActiveView={setActiveView} defaultActiveKey="tasks" />
      <div className="lg:ml-[20%] p-8 flex-grow">
        {views[activeView] || <p>View not found</p>}
      </div>
    </div>
  );
};

export default MainPage;
