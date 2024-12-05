import React from "react";
import { NavLink } from "react-router-dom";

const Settings = () => {
  return (
    <div className="w-full px-4">
      <div className="w-full flex items-center justify-between py-4">
        {/* Heading */}
        <h1 className="text-3xl font-semibold">Templates</h1>

        {/* Buttons Container */}
        <div className="flex gap-4 my-4 ">
            <button
              type="button"
              class="px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Save Settings</span>
            </button>
            <NavLink to="/" end>
            <button
              type="button"
              class="px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>

              <span>Go Back</span>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Settings;
