import React, { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import useStore from "../Store";

const Drawer = ({ isDrawerOpen, toggleDrawer }) => {
  const { settings, setSettings: updateStoreSettings } = useStore();
  
  const [localSettings, setLocalSettings] = useState({
    allowTemplateEdit: false,
    allowChecklistEdit: false,
  });

  // Fetch initial settings when the component mounts
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Function to save settings to the database
  const setSettings = async (newSettings) => {
    try {
      const response = await invoke("setSettings", {
        currentRoute: window.location.href,
        newSettings,
      });
      console.log("Settings saved:", response);
      
      // Update the settings in the Zustand store
      updateStoreSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Handler for toggle change
  const handleToggleChange = (key) => {
    const updatedSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updatedSettings);

    // Directly save the updated settings and update the store
    setSettings(updatedSettings);
  };

  return (
<div>
  {isDrawerOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30"
      onClick={toggleDrawer} // Clicking the overlay closes the drawer
    ></div>
  )}

  <div
    id="drawer-example"
    className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${
      isDrawerOpen ? "translate-x-0" : "-translate-x-full"
    } bg-white dark:bg-darkBg w-full sm:w-[25vw]`} // Full width on small screens, 25vw on larger screens
    tabindex="-1"
    aria-labelledby="drawer-label"
  >
        <h5
          id="drawer-label"
          className="inline-flex text-4xl items-center mb-4 font-semibold text-gray-500 dark:text-gray-400"
        >
          {"<- Settings"}
        </h5>

        <div className="space-y-4 w-max">
          <div className="w-full">
            <label
              htmlFor="toggle"
              className="text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Template Settings
            </label>
            <div className="flex items-center gap-4 justify-between border p-4 mt-2 w-full max-w-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-darkBg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow every user to edit template
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
            <label
              htmlFor="toggle-2"
              className="text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              Checklist Settings
            </label>
            <div className="flex items-center gap-4 justify-between border p-4 mt-2 w-full max-w-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-darkBg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow every user to edit checklist
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
