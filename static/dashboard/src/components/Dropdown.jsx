import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({ selected, taskId, handleStatusChange, isViewable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const options = [
    {
      value: "To Do",
      label: "To Do",
      style:
        "bg-[#E9F2FF] text-[#0055CC] dark:bg-[#1C2B41] dark:text-[#85B8FF]",
    },
    {
      value: "In Progress",
      label: "In Progress",
      style:
        "bg-[#F3F0FF] text-[#5E4DB2] dark:bg-[#2B273F] dark:text-[#B8ACF6]",
    },
    {
      value: "Done",
      label: "Done",
      style:
        "bg-[#DCFFF1] text-[#216E4E] dark:bg-[#1C3329] dark:text-[#7EE2B8]",
    },
    {
      value: "Skipped",
      label: "Skipped",
      style:
        "bg-[#FFF7D6] text-[#A54800] dark:bg-[#332E1B] dark:text-[#F5CD47]",
    },
    {
      value: "Failed",
      label: "Failed",
      style:
        "bg-[#FFECEB] text-[#AE2E24] dark:bg-[#42221F] dark:text-[#FD9891]",
    },
  ];

  const handleSelect = (value) => {
    handleStatusChange(taskId, value);
    setIsOpen(false);
    setOpenDropdownId(null); 
  };

  const toggleDropdown = () => {
    if (openDropdownId === taskId) {
      setIsOpen(false); 
      setOpenDropdownId(null); 
    } else {
      setIsOpen(true); 
      setOpenDropdownId(taskId); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenDropdownId(null); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-max h-max" ref={dropdownRef}>
      <div
        className={`w-[100px] text-base px-2 py-1 border-gray-300 dark:border-gray-500 rounded-md ${isViewable ? "cursor-default" : "cursor-pointer" }  ${
          options.find((option) => option.value === selected)?.style
        }`}
        onClick={isViewable ? undefined : toggleDropdown}
      >
        <span>
          {options.find((option) => option.value === selected)?.label}
        </span>
      </div>

      {isOpen && (
         <div className="absolute mt-1 bg-white dark:bg-darkBg w-max z-10 border border-gray-300 dark:border-gray-600 px-3 p-4 shadow-lg rounded-md">

          {options.map((option) => (
            <div
              key={option.value}
              className={`px-2 py-1 w-max cursor-pointer text-base rounded-md mb-3 ${option.style}`}
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
