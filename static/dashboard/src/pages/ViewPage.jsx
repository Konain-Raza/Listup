import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import "../index.css";

const View = () => {
  const location = useLocation();
  const [viewTemplate, setViewTemplate] = useState(null);

  useEffect(() => {
    if (location.state?.viewTemplate) {
      setViewTemplate(location.state.viewTemplate);
    }
  }, [location]);

  return (
    <div className="w-full px-4 dark:bg-darkBg h-max min-h-screen">
      <div className="w-full flex items-center justify-between pt-4 pb-2">
        <h1 className="dark:text-darkHeading font-semibold text-4xl">
          {viewTemplate?.name || "Template Name"}
        </h1>

        <div className="flex my-4 ">
          <div className="flex justify-center items-center px-6 py-3.5 relative group">
            <div className="tooltip" data-tip="Locked Template">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
          </div>

          <NavLink to="/" end>
            <button
              type="button"
              className="dark:bg-[#A1BDD914] dark:text-white px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200  dark:hover:bg-gray-900 rounded-lg text-center"
            >
              <span>Go Back</span>
            </button>
          </NavLink>
        </div>
      </div>

      <div className="mb-5 w-max-2xl">
        <div className="my-3">
          {viewTemplate && viewTemplate.description.length > 0 && (
            <>
              <label
                htmlFor="description"
                className="block text-xl font-semibold dark:text-white text-gray-700 mb-1"
              >
                Description
              </label>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
                {viewTemplate?.description || "No description provided."}
              </p>
            </>
          )}
        </div>
        <hr className="dark:border-[#A6C5E229] dark:text-[#A6C5E229]" />
      </div>
      <div className="w-full h-full">
      
            {viewTemplate?.items?.length > 0 ? (
              viewTemplate.items.map((task, index) => (
                <TaskItem
                  isViewable={true}
                  key={task.id || index}
                  task={task}
                  handleStatusChange={() => {}}
                  handleDeleteTask={() => {}}
                  handleTitleChange={() => {}}
                  
                />
              ))
            ) : (
              <div className="row">
                <p
          
                  className="text-center dark:text-[#626F86] w-[670px]"
                >
                  No items available
                </p>
              </div>
            )}
          
    </div>
    </div>

  );
};

export default View;
