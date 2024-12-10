import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import "../index.css";

const View = () => {
  const location = useLocation();
  const [viewTemplate, setViewTemplate] = useState(null);

  useEffect(() => {
    const { viewTemplate } = location.state || {};
    if (viewTemplate) {
      setViewTemplate(viewTemplate);
    }
  }, [location.state]);

  return (
    <div className="w-full px-4 dark:bg-darkBg h-max min-h-screen">
      <div className="w-full flex items-center justify-between pt-4 pb-2">
        <h1 className="dark:text-darkHeading font-semibold text-4xl">
          {viewTemplate?.name || "Template Name"}
        </h1>

        <NavLink to="/" end>
          <button
            type="button"
            className="dark:bg-[#A1BDD914] dark:text-white px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:hover:bg-gray-900 rounded-lg text-center"
          >
            <span>Go Back</span>
          </button>
        </NavLink>
      </div>

      <div className="mb-5 w-max-2xl">
        <div className="my-3">
          <label
            htmlFor="description"
            className="block text-xl font-semibold dark:text-white text-gray-700 mb-1"
          >
            Description
          </label>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
            {viewTemplate?.description || "No description provided."}
          </p>
        </div>
        <hr />
      </div>

      <div className="w-full h-full">
        <table className="w-[70%] max-w-max table-auto border-collapse dark:border-[#A6C5E229] h-auto">
          <thead>
            <tr className="row rounded-md">
              <th className="ml-2 dark:text-[#626F86]">List Item</th>
              <th className="ml-2 dark:text-[#626F86]">Status</th>
            </tr>
          </thead>
          <tbody className="dark:border-[#A6C5E229]">
            {(viewTemplate?.items?.length > 0 ? viewTemplate.items : []).map(
              (task, index) => (
                <TaskItem
                  isViewable={!!viewTemplate}
                  key={task.id || index}
                  task={task}
                  handleStatusChange={() => console.log("status")}
                  handleDeleteTask={() => console.log("status")}
                  handleTitleChange={() => console.log("status")}
                />
              )
            )}
            {viewTemplate?.items?.length === 0 && (
              <tr className="row">
                <td
                  colSpan={3}
                  className="text-center py-4 dark:text-[#626F86]"
                >
                  No items available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default View;
