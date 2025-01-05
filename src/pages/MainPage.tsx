import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import SideMenu from "../components/Navigation/SideMenu.tsx";
import CalendarView from "../components/Calendar/CalendarView.tsx";
import TaskView from "../components/TaskView/TaskView.tsx";
import Analytics from "../components/Analytics/Analytics.tsx";
import { TaskProvider } from "../Context/TaskContext.tsx";
import HoverAIButton from "../components/AI/ButtonAI.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MainPage: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("tasks");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // To handle loading state

  const auth = getAuth();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [auth]);

  // If authentication state is still loading, you might want to show a loading spinner or similar
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to sign-in page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const views: { [key: string]: JSX.Element } = {
    tasks: <TaskView />,
    calendar: <CalendarView />,
    analytics: <Analytics />,
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
