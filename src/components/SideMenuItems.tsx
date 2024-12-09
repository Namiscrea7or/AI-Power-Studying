import React from "react";

interface SideMenuItemProps {
  name: string;
  itemKey: string;
  onClick: (key: string) => void;
  active: boolean;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({ name, itemKey, onClick, active }) => {
  const buttonClass = `block w-full text-left p-2 mb-2 rounded ${
    active ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"
  }`;

  return (
    <button
      className={buttonClass}
      onClick={() => onClick(itemKey)}
    >
      {name}
    </button>
  );
};

export default SideMenuItem;
