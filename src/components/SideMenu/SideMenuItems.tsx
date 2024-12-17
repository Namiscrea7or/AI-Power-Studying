import React from "react";

interface SideMenuItemProps {
  name: string;
  itemKey: string;
  onClick: (key: string) => void;
  active: boolean;
  icon: any;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
  name,
  itemKey,
  onClick,
  active,
  icon,
}) => {
  return (
    <button
      className={`flex items-center gap-2 w-full text-left p-2 mb-2 rounded ${
        active ? "bg-blue-100 font-semibold" : "hover:bg-blue-50"
      }`}
      onClick={() => onClick(itemKey)}>
      {icon} {name}
    </button>
  );
};

export default SideMenuItem;
