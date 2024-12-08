import React from "react";

const ProgressBar = ({ value, max }) => {
  const percentage = Math.min((value / max) * 100, 100).toFixed(2); // Ensure percentage doesn't exceed 100
  const barColor = percentage === "100.00" ? "bg-green-500" : "bg-blue-500";

  return (
    <div className="w-full max-w-2xl"> {/* Increase max width here */}
      <h5 className="text-lg font-semibold mb-2">Total Tasks</h5>
      <div className="w-full flex items-center justify-between">
        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden"> {/* Full width */}
          <div
            className={`h-4 ${barColor}`}
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
