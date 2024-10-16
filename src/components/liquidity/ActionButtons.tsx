import React from "react";

interface ActionButtonsProps {
  activeTab: string;
  handleToggle: (tab: string) => void;
  tabs: { label: string; value: string }[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  activeTab,
  handleToggle,
  tabs,
}) => {
  return (
    <div className="flex items-center justify-center w-full bg-input-grad rounded-full border-cardborder border-2">
      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          className={`${
            activeTab === tab.value
              ? index === 0
                ? "bg-green-grad"
                : "bg-red-grad"
              : "bg-transparent"
          } px-2 py-2 w-1/2 rounded-full`}
          onClick={() => handleToggle(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
