import EraserIcon from "@/components/icons/Eraser";
import PenIcon from "@/components/icons/Pen";

import React from "react";

const Tools = ({
  handleToolChange,
  selectedTool,
  handleChangeColor,
  defaultColor,
  isDisabled,
}: ToolsProps) => {
  const tools: Tools = [
    {
      title: "Pen",
      icon: <PenIcon />,
      name: "pen",
    },
    {
      title: "Eraser",
      icon: <EraserIcon />,
      name: "eraser",
    },
  ];
  return (
    <div className="flex items-center gap-4 bg-[#808080] text-black p-1">
      {tools.map((item) => (
        <button
          key={item.name}
          onClick={() => handleToolChange(item.name)}
          className={`w-11 ${
            selectedTool === item.name ? "shadow-xl bg-white rounded-lg" : ""
          }`}
          title={item.title}
          disabled={isDisabled}
        >
          {item.icon}
        </button>
      ))}
      {/* <button
      onClick={() => handleToolChange("pen")}
      className="w-11"
      title="Pen"
    ></button>
    <button
      onClick={() => handleToolChange("eraser")}
      className="w-11"
      title="Eraser"
    ></button> */}
      <input
        type="color"
        className="h-10"
        onChange={(e) => handleChangeColor(e.target.value)}
        defaultValue={defaultColor}
        title="Choose Color"
        disabled={isDisabled}
      />
    </div>
  );
};

interface ToolsProps {
  handleToolChange: (selectedTool: ToolsType) => void;
  handleChangeColor: (value: string) => void;
  selectedTool: ToolsType;
  defaultColor: string;
  isDisabled: boolean;
}

type Tools = {
  title: string;
  icon: JSX.Element;
  name: ToolsType;
}[];

export default Tools;
