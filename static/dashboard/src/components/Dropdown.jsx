import React, { useState } from "react";

const Dropdown = ({ selected, taskId, handleStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "To Do", label: "To Do", style: "bg-[#E9F2FF] text-[#0055CC] dark:bg-[#1C2B41] dark:text-[#85B8FF]" },
    {
      value: "In Progress",
      label: "In Progress",
      style: "bg-[#F3F0FF] text-[#5E4DB2] dark:bg-[#2B273F] dark:text-[#B8ACF6]",
    },
    { value: "Done", label: "Done", style: "bg-[#DCFFF1] text-[#216E4E] dark:bg-[#1C3329] dark:text-[#7EE2B8]" },
    { value: "Skipped", label: "Skipped", style: "bg-[#FFF7D6] text-[#A54800] dark:bg-[#332E1B] dark:text-[#F5CD47mjh]" },
  ];

  const handleSelect = (value) => {
    handleStatusChange(taskId, value);m
    // setStatus(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-max">
      <div
        className={`w-max text-base px-2 py-1 border-gray-300  dark:border-gray-500  rounded-md cursor-pointer ${
          options.find((option) => option.value === selected)?.style
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {options.find((option) => option.value === selected)?.label}
        </span>
      </div>

      {isOpen && (
        <div className="absolute mt-1 dark:bg-darkBg  w-max z-10 shadow-lg bg-white border-gray-500 px-3 h-max p-1">
          {options.map((option) => (
              <div
                key={option.value}
                className={`px-2 py-1 w-max cursor-pointer text-base rounded-md mb-1   ${option.style}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
