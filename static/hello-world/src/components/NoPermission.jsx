import React from "react";
import Warning from "../assets/icons/warning";

const WarningMessage = ({ title, message }) => {
  return (
    <div className="flex items-start bg-[#FFECEB] dark:bg-[#42221F] p-4 py-3">
      <div className="mt-2 w-max justify-items-center">
        <Warning />
      </div>
      <div className="flex flex-col my-3">
        <h3 className="text-base mb-1 font-bold text-[#172B4D] dark:text-gray-300">
          {title}
        </h3>
        <p className="text-[#172B4D] dark:text-gray-300 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default WarningMessage;
