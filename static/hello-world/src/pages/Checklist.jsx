import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import AddItemForm from "../components/AddItemForm";
import TaskItem from "../components/TaskItem";
import useStore from "../Store";
import { view, invoke } from "@forge/bridge";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const CheckList = () => {
  const navigate = useNavigate();
  const { issueKey, tasks, setTasks, templates, setTemplates } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [completedTasksLength, setCompletedTasksLength] = useState(0);
  const [inputStatus, setInputStatus] = useState("To Do");
  const [activeGroup, setActiveGroup] = useState(null);
  const toggleAccordion = (templateName) => {
    // Toggle the active group
    setActiveGroup(activeGroup === templateName ? null : templateName);
  };

  useEffect(() => {
    setCompletedTasksLength(
      tasks.filter((task) => task.status === "Done").length
    );
    console.log(completedTasksLength, "Completed");
  }, [tasks]);

  const handleClearAllTasks = async () => {
    if (!tasks.length) {
      toast.warning("No tasks to clear.");
      return;
    }

    if (!window.confirm("Are you sure you want to clear all tasks?")) return;

    try {
      setTasks([]);
      setTemplates((prev) => ({ ...prev, used: [] }));
      await invoke("setTasks", { issueKey, tasks: [] });
      toast.success("All tasks have been cleared successfully!");
    } catch (error) {
      console.error("Error while clearing tasks:", error);
      toast.error("Failed to clear tasks.");
    }
  };

  const handleAddTask = async (template) => {
    if (
      !template?.name ||
      !Array.isArray(template.items) ||
      !template.items.length
    ) {
      toast.warning("Invalid or empty template.");
      return;
    }

    if (template.items.some((item) => !item?.title)) {
      toast.error("Some tasks are missing titles.");
      return;
    }

    if (!inputStatus) {
      toast.warning("Please select a status for the tasks.");
      return;
    }

    setIsAddingTask(true);

    try {
      const newTasks = template.items.map((item, i) => ({
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: item.title || `Task ${i + 1}`,
        status: inputStatus,
        checked: inputStatus === "Done",
        templateName: template.name || "Custom",
      }));

      const updatedTasks = [...newTasks, ...tasks];
      setTasks(updatedTasks);
      invoke("setTasks", { issueKey, tasks: updatedTasks });

      // Update templates and store the updated state in a variable
      const updatedTemplates = {
        ...templates,
        used: templates.used.includes(template.name)
          ? templates.used
          : [...templates.used, template.name],
        all: templates.all.some((t) => t.name === template.name)
          ? templates.all
          : [...templates.all, template],
      };
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error("Error while adding tasks:", error);
      toast.error("Failed to add tasks.");
    } finally {
      setInputStatus("To Do");
      setIsAddingTask(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    console.log("Status changed", status);
    console.log("Id", id);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status, checked: status === "Done" } : task
    );

    // Log the updated tasks to see if it's being updated correctly
    console.log("Updated Tasks:", updatedTasks);

    setTasks(updatedTasks); // Updating state

    try {
      // Log the data you're passing to `invoke` for debugging purposes
      console.log("Updating tasks with:", { issueKey, tasks: updatedTasks });

      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteTask = async (id) => {
    console.log("starting delete task");
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
      console.log("done deleting tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };
  const handleDeleteTemplates = async (templateName) => {
    console.log(`Delete all tasks in ${templateName}`);

    const updatedTasks = tasks.filter(
      (task) => task.templateName !== templateName
    );
    console.log("Updated Tasks:", updatedTasks);
    setTasks(updatedTasks);

    const updatedTemplates = {
      ...templates,
      used: templates.used.filter(
        (templateName) => templateName !== templateName
      ),
    };
    console.log("Updated Templates:", updatedTemplates);
    setTemplates(updatedTemplates);
    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div className="w-full h-max pb-10">
      <div className="header">
        <div className="w-full flex justify-between items-center">
          <ProgressBar value={completedTasksLength} max={tasks.length} />
          <div className="w-max flex items-center">
            <PrimaryButton
              className={"px-4 md:px-8 py-2 md:py-3 "}
              label="Open Templates"
              keyType="templates"
              onClick={() => navigate("/templates")}
            />
            <PrimaryButton
              className={"px-4 md:px-8 py-2 md:py-3 "}
              label="Clear All Tasks"
              keyType="delete"
              onClick={handleClearAllTasks}
            />
          </div>
        </div>
      </div>

      <AddItemForm handleAddItem={handleAddTask} />

      <div className="dark:bg-darkBg h-full">
        {tasks
          .filter((task) => task.templateName !== "Custom")
          .reduce((acc, task) => {
            const lastGroup = acc[acc.length - 1];
            if (!lastGroup || lastGroup.templateName !== task.templateName) {
              acc.push({ templateName: task.templateName, tasks: [task] });
            } else {
              lastGroup.tasks.push(task);
            }
            return acc;
          }, [])
          .map((group) => (
            <div
              key={group.templateName}
              className="w-full p-5 border dark:border-[#A6C5E229]"
            >
              <div className="text-left mb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(group.templateName)}
                >
                  <span className="text-base text-gray-700  dark:text-darkHeading ">
                    {group.templateName}
                  </span>

                  <span className="flex items-center">
                    <button
                      className="text-red-500 px-3 py-1 rounded-lg text-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion toggle when delete is clicked
                        handleDeleteTemplates(group.templateName);
                      }}
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                    {/* SVG for Chevron up/down based on active group */}
                    {activeGroup === group.templateName ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 dark:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                         className="size-6 dark:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              {/* Accordion content */}
              <div
                className={`transition-all duration-300 ${
                  activeGroup === group.templateName
                    ? "max-h-[5000px] block"
                    : "max-h-0 hidden"
                }`}
              >
                {/* Table */}
                <table
                  className={`w-full table-auto border-collapse dark:border-[#A6C5E229] h-auto rounded-xl`}
                >
                  <thead>
                    <tr className="row rounded-md">
                      <th className="ml-2 dark:text-[#626F86] text-gray-700"></th>
                      <th className="ml-2 dark:text-[#626F86] text-gray-700">
                        List Item
                      </th>
                      <th className="ml-2 dark:text-[#626F86] text-gray-700">
                        Status
                      </th>
                      <th className="ml-2 dark:text-[#626F86] text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="dark:border-[#A6C5E229]">
                    {group.tasks.length > 0 ? (
                      group.tasks.map((task, index) => (
                        <TaskItem
                          isViewable={false}
                          key={task.id || index}
                          task={task}
                          handleStatusChange={handleStatusChange}
                          handleDeleteTask={handleDeleteTask}
                        />
                      ))
                    ) : (
                      <tr className="row">
                        <td
                          colSpan={4} // Adjusted to span the correct number of columns
                          className="text-center dark:text-[#626F86]"
                        >
                          No items available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {tasks.filter((task) => task.templateName === "Custom").length > 0 && (
          <div
            key={"Custom"}
            className="w-full p-5 border dark:border-[#A6C5E229]"
          >
            <div className="text-left mb-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion("Custom")}
              >
                <span className="text-base  dark:text-darkHeading">Custom</span>

                <span className="flex items-center">
                  <button
                    className="text-red-500 px-3 py-1 rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion toggle when delete is clicked
                      handleDeleteTemplates("Custom");
                    }}
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                  {/* SVG for Chevron up/down based on active group */}
                  {activeGroup === "Custom" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 dark:text-white"

                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 15.75 7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 dark:text-white"

                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ${
                activeGroup === "Custom"
                  ? "max-h-[5000px] block"
                  : "max-h-0 hidden"
              }`}
            >
              <table className="w-full table-auto border-collapse dark:border-[#A6C5E229] h-auto rounded-lg">
                <thead>
                  <tr className="row rounded-md">
                    <th className="ml-2 dark:text-[#626F86]"></th>
                    <th className="ml-2 dark:text-[#626F86]">List Item</th>
                    <th className="ml-2 dark:text-[#626F86]">Status</th>
                    <th className="ml-2 dark:text-[#626F86]">Action</th>
                  </tr>
                </thead>
                <tbody className="dark:border-[#A6C5E229]">
                  {tasks.filter((task) => task.templateName === "Custom")
                    .length > 0 ? (
                    tasks
                      .filter((task) => task.templateName === "Custom")
                      .map((task) => (
                        <TaskItem
                          key={task.id}
                          isViewable={false}
                          task={task}
                          handleStatusChange={handleStatusChange}
                          handleDeleteTask={handleDeleteTask}
                        />
                      ))
                  ) : (
                    <tr className="row">
                      <td
                        colSpan={4}
                        className="text-center dark:text-[#626F86]"
                      >
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckList;
