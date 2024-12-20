import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import useStore from "../Store";
import { invoke } from "@forge/bridge";
import Warning from "../assets/icons/warning";

export default function DeleteModal({ isOpen, setIsOpen }) {
  const { templates, issueKey, setTemplates, tasks, setTasks } = useStore();

  const handleClearAllTasks = async () => {
    if (!tasks.length) {
      toast.warning("No tasks to clear.");
      return;
    }
    try {
      setTasks([]);
      setTemplates({
        all: templates.all,
        used: [],
      });
      setIsOpen(false);

      await invoke("setTasks", { issueKey, tasks: [] });
    } catch (error) {
      console.error("Error while clearing tasks:", error);
      toast.error("Failed to clear tasks.");
    }
  };

  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 overflow-x-hidden">
      <div className="relative p-4 w-full max-w-xl flex items-center justify-center">
        <div className="bg-white rounded-lg shadow dark:bg-[#282E33]">
          <div className="flex justify-between items-start p-3 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-2 mt-2">
              <Warning />
              <h3 className="text-2xl font-normal text-gray-900 dark:text-white m-0">
                Confirm Deletion
              </h3>
            </div>

            <button
              onClick={closeModal}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Are you sure you want to delete all tasks? This action cannot be
              undone.
            </p>
          </div>

          <div className="flex items-center justify-end p-6 space-x-2">
            <button
              onClick={closeModal}
              className="rounded-lg text-sm px-3 py-2 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAllTasks}
              className="bg-red-700 hover:bg-red-800 rounded-sm text-sm text-white px-3 py-2 dark:bg-red-500 dark:hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
