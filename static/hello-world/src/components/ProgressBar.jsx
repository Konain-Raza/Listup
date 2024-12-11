import React from "react";

const ProgressBar = ({ value, max }) => {
  // Handle case when max is 0 to avoid division by zero
  const percentage =
    max > 0 ? Math.min((value / max) * 100, 100).toFixed(2) : 0;

  const barColor = percentage >= 100 ? "bg-green-500" : "bg-blue-500 dark:bg-[#9FADBC]";

  return (
    <div className="w-full max-w-2xl">
      {" "}
      {/* Increase max width here */}
      <h5 className="text-lg font-semibold mb-2 dark:text-white ">
        Total Tasks
      </h5>
      <div className="w-full flex items-center justify-between">
        <div className="w-full bg-gray-300 dark:bg-[] rounded-full h-2 overflow-hidden ">
          {" "}
          {/* Full width */}
          <div
            className={`h-2 ${barColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-700 pl-2">
          {value}/{max}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
