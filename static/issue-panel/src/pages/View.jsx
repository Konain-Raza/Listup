import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import "../index.css";

const View = () => {
  const location = useLocation();
  const [viewTemplate, setViewTemplate] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const { viewTemplate } = location.state || {};
    if (viewTemplate) {
      setViewTemplate(viewTemplate);
    }
  }, [location.state]);

  return (
    <div className="w-full dark:bg-darkBg h-max min-h-screen">
      <div className="w-full flex items-center justify-between pt-4 pb-2">
        <h1 className="dark:text-darkHeading font-semibold text-2xl">
          {viewTemplate?.name || "Template Name"}
        </h1>

        <button onClick={() => navigate("/templates")} type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 dark:text-darkHeading text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mb-5 w-max-2xl">
        <div className="">
          {viewTemplate && viewTemplate.description.length > 0 && (
            <>
            
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-2">
                {viewTemplate?.description || "No description provided."}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-full mb-3">
        {(viewTemplate?.items?.length > 0 ? viewTemplate.items : []).map(
          (task, index) => (
            <TaskItem
              isViewable={true}
              key={task.id || index}
              task={task}
              handleStatusChange={() => {}}
              handleDeleteTask={() => {}}
              handleTitleChange={() => {}}
            />
          )
        )}
        {viewTemplate?.items?.length === 0 && (
          <div className="row">
            <p className="text-center py-4 dark:text-[#626F86]">
              No items available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default View;
