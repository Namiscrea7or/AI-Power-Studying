import React from "react";
import { useState } from "react";
import SideMenu from "../components/SideMenu.tsx";
import TaskList from "../components/TaskList.tsx";
import CalendarView from "../components/CalendarView.tsx";

const MainPage: React.FC = () => {
    const [activeView, setActiveView] = useState<string>('tasks');

    const views: { [key: string]: JSX.Element } = {
        tasks: <TaskList />,
        calendar: <CalendarView />,
        // analytics: <Analytics />,
        // settings: <Settings />,
    };

    return (
        <div className="flex h-screen">
            <SideMenu setActiveView={setActiveView} defaultActiveKey="tasks" />
            <div className="p-4">
                {views[activeView] || <p>View not found</p>}
            </div>
        </div>
    );
};

export default MainPage