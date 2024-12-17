import React, { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import useStore from "../Store";
import {toast } from "react-toastify";


const Drawer = ({ isDrawerOpen, toggleDrawer }) => {
  const { settings, setSettings: updateStoreSettings } = useStore();

  const [localSettings, setLocalSettings] = useState({
    allowTemplateEdit: false,
    allowChecklistEdit: false,
  });

  useEffect(() => {
    if (Array.isArray(settings) || Object.keys(settings).length === 0) {
      setLocalSettings({
        allowTemplateEdit: false,
        allowChecklistEdit: false,
      });
    } else {
      setLocalSettings(settings);
    }
  }, [settings]);

  const setSettings = async (newSettings) => {
    try {
      const response = await invoke("setSettings", {
        newSettings,
      });
      updateStoreSettings(newSettings);
    } catch (error) {
      toast.error("Error saving settings:", error);
    }
  };

  const handleToggleChange = (key) => {
    const updatedSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  return (
    <div>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleDrawer}
        ></div>
      )}

      <div
        id="drawer-example"
        className={`fixed top-0 left-0 z-50 h-screen p-4 overflow-y-auto transition-transform transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-darkBg w-max`}
        tabindex="-1"
        aria-labelledby="drawer-label"
      >
        <div className="w-full inline-flex justify-items-start gap-2 items-center">
          <button
            className="flex items-center justify-center  dark:text-gray-400"
            onClick={toggleDrawer}
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <h5
            id="drawer-label"
            className="inline-flex text-3xl items-center  font-semibold text-gray-500 dark:text-gray-400"
          >
            {"Settings"}
          </h5>
        </div>

        <div className="space-y-4 w-max">
          <div className="w-full my-5">
           
            <div className="flex items-center gap-4 justify-between border p-4 mt-2 w-full max-w-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-darkBg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow every user to edit the checklist template
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.allowTemplateEdit}
                  onChange={() => handleToggleChange("allowTemplateEdit")}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="w-full">
         
            <div className="flex items-center gap-4 justify-between border p-4 mt-2 w-full max-w-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-darkBg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow every user to edit the checklist in the ticket
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.allowChecklistEdit}
                  onChange={() => handleToggleChange("allowChecklistEdit")}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
