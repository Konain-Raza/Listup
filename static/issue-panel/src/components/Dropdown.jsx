import React from 'react';

const Dropdown = ({ selected, taskId, handleStatusChange, isViewable }) => {
  const options = [
    { value: 'To Do', label: 'To Do', style: 'bg-[#E9F2FF] text-[#0055CC] dark:bg-[#1C2B41] dark:text-[#85B8FF]' },
    { value: 'In Progress', label: 'In Progress', style: 'bg-[#F3F0FF] text-[#5E4DB2] dark:bg-[#2B273F] dark:text-[#B8ACF6]' },
    { value: 'Done', label: 'Done', style: 'bg-[#DCFFF1] text-[#216E4E] dark:bg-[#1C3329] dark:text-[#7EE2B8]' },
    { value: 'Skipped', label: 'Skipped', style: 'bg-[#FFF7D6] text-[#A54800] dark:bg-[#332E1B] dark:text-[#F5CD47]' },
    { value: 'Failed', label: 'Failed', style: 'bg-[#FFECEB] text-[#AE2E24] dark:bg-[#42221F] dark:text-[#FD9891]' },
  ];

  const handleChange = (event) => {
    handleStatusChange(taskId, event.target.value);
  };

  // Adjust the width, height, or padding as needed here
  const dropdownStyle = `w-max font-bold uppercase bg-no-repeat bg-right appearance-none h-max focus:outline-none text-sm px-[8px] py-[2px] border:none rounded-md cursor-pointer`;

  // Find the current selected option to apply the right styles directly in the select className
  const selectedOptionStyle = options.find(option => option.value === selected)?.style || '';

  return (
    <div className="relative">
      <select
        onChange={handleChange}
        value={selected}
        disabled={isViewable}
        className={`${dropdownStyle} ${selectedOptionStyle}`}
        style={{
      backgroundImage: 'none'
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className={option.style}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
