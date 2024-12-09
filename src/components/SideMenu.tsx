import React, { useState } from "react";
import SideMenuItem from "./SideMenuItems.tsx";

interface SideMenuProps {
  setActiveView: (key: string) => void;
  defaultActiveKey?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ setActiveView, defaultActiveKey = "tasks" }) => {
  const menuItems = [
    { name: "Task List", key: "tasks" },
    { name: "Calendar", key: "calendar" },
    { name: "Analytics", key: "analytics" },
    { name: "Settings", key: "settings" },
  ];

  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  const handleClick = (key: string) => {
    setActiveKey(key);
    setActiveView(key);
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      {menuItems.map((item) => (
        <SideMenuItem
          key={item.key}
          name={item.name}
          itemKey={item.key}
          onClick={handleClick}
          active={item.key === activeKey}
        />
      ))}
    </div>
  );
};

export default SideMenu;
