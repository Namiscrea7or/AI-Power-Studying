import React, { useState } from "react";
import SideMenuItem from "../SideMenu/SideMenuItems.tsx";
import { GoHome, GoCalendar, GoGraph } from "react-icons/go";

interface SideMenuProps {
  setActiveView: (key: string) => void;
  defaultActiveKey?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({
  setActiveView,
  defaultActiveKey = "tasks",
}) => {
  const menuItems = [
    { name: "Tasks", key: "tasks", icon: <GoHome /> },
    { name: "Calendar", key: "calendar", icon: <GoCalendar /> },
    { name: "Analytics", key: "analytics", icon: <GoGraph /> },
  ];

  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  const handleClick = (key: string) => {
    setActiveKey(key);
    setActiveView(key);
  };

  return (
    <div className="fixed hidden lg:block h-dvh w-[20%] text-black p-4 border-r">
      {menuItems.map((item) => (
        <SideMenuItem
          icon={item.icon}
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
