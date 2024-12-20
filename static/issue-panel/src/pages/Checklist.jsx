import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import AddItemForm from "../components/AddItemForm";
import TaskItem from "../components/TaskItem";
import useStore from "../Store";
import { view, invoke } from "@forge/bridge";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import DeleteModal from "../components/Modal";
import { format } from "date-fns";

import "../index.css";
import Trash from "../assets/icons/trash";

const CheckList = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { issueKey, tasks, setTasks, templates, setTemplates } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [completedTasksLength, setCompletedTasksLength] = useState(0);
  const [inputStatus, setInputStatus] = useState("To Do");
  const [activeGroup, setActiveGroup] = useState(null);

  const toggleAccordion = (templateName) => {
    setActiveGroup(activeGroup === templateName ? null : templateName);
  };

  useEffect(() => {
    setCompletedTasksLength(
      tasks.filter((task) => task.status === "Done").length
    );
  }, [tasks]);

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
      if (activeGroup !== "Custom") {
        setActiveGroup("Custom");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    const today = format(new Date(), "dd-MM-yyyy");
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status,
            checked: status === "Done",
            completedAt: status === "Done" ? today : undefined,
          }
        : task
    );

    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update status.");
    }
  };

  const updateDueDate = async (id, dueDate) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, dueDate } : task
    );

    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task due date:", error);
      toast.error("Failed to update due date.");
    }
  };

  const handleDeleteTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleDeleteTemplates = async (templateName) => {
    const updatedTasks = tasks.filter(
      (task) => task.templateName !== templateName
    );

    setTasks(updatedTasks);

    const updatedTemplates = {
      ...templates,
      used: templates.used.filter((name) => name !== templateName),
    };

    setTemplates(updatedTemplates);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };
  const handleDeleteAll = () => {
    
    if (tasks.length == 0) {
      toast.error("No tasks to delete.");
      return;
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full h-max pb-4">
      <DeleteModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className=" w-full h-max mb-4">
        <div className="header">
          <div className="w-full flex justify-between items-end">
            <ProgressBar value={completedTasksLength} max={tasks.length} />
            <div className="w-max flex items-center">
              <PrimaryButton
                className={"px-4 md:px-4 py-2 md:py-2 "}
                label="Add Checklist(s)"
                keyType="templates"
                onClick={() => navigate("/templates")}
              />
              <PrimaryButton
                className={"px-4 md:px-4 py-2 md:py-2 "}
                label="Delete Checklist"
                keyType="delete"
                onClick={() => handleDeleteAll()}
              />
            </div>
          </div>
        </div>

        <AddItemForm handleAddItem={handleAddTask} />
      </div>
      <div className="dark:bg-darkBg h-max pb-4 w-full px-1">
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
              className="w-full mb-4 border-none dark:border-[#A6C5E229]"
            >
              <div className="text-left mb-2 bg-[#F8F8F8] dark:bg-[#22272B] p-3 rounded-md">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(group.templateName)}
                >
                  <div className="text-base font-bold gap-6 w-max items-center flex text-[#626F86]  dark:text-darkHeading ">
                    {activeGroup === group.templateName ? (
                      <div className="w-max p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4  dark:text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-max p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 dark:text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    )}
                    {group.templateName &&
                      group.templateName.charAt(0).toUpperCase() +
                        group.templateName.slice(1)}
                  </div>

                  <span className="flex items-center">
                    <button
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplates(group.templateName);
                      }}
                    >
                      <Trash />
                    </button>
                  </span>
                </div>
              </div>

              <div
                className={`transition-all duration-300 my-4 ${
                  activeGroup === group.templateName
                    ? "max-h-max block"
                    : "max-h-0 hidden"
                }`}
              >
                {group.tasks.length > 0 ? (
                  group.tasks.map((task, index) => (
                   <div className="px-3">
                     <TaskItem
                      isViewable={false}
                      key={task.id || index}
                      task={task}
                      handleStatusChange={handleStatusChange}
                      handleDeleteTask={handleDeleteTask}
                      updateDueDate={updateDueDate}
                    />
                    </div>
                  ))
                ) : (
                  <tr className="w-full">
                    <p
                      className="text-center dark:text-[#626F86]"
                    >
                      No items available
                    </p>
                  </tr>
                )}
              </div>
            </div>
          ))}

        {tasks.filter((task) => task.templateName === "Custom").length > 0 && (
          <div
            key={"Custom"}
            className="w-full mb-2 border-none dark:border-[#A6C5E229]"
          >
            <div className="text-left mb-2 bg-[#F8F8F8] dark:bg-[#22272B] p-3 rounded-md">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion("Custom")}
              >
                <div className="text-base font-bold gap-6 w-max items-center flex text-[#626F86] dark:text-darkHeading ">
                  {activeGroup === "Custom" ? (
                    <div className="w-max p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4  dark:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-max p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 dark:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  )}
                  Custom
                </div>

                <span className="flex items-center">
                  <button
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion toggle when delete is clicked
                      handleDeleteTemplates("Custom");
                    }}
                  >
                    <Trash />
                  </button>
                  {/* SVG for Chevron up/down based on active group */}
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-300 my-4 ${
                activeGroup === "Custom" ? "max-h-max block" : "max-h-0 hidden"
              }`}
            >
              {tasks.filter((task) => task.templateName === "Custom").length >
              0 ? (
                tasks
                  .filter((task) => task.templateName === "Custom")
                  .map((task) => (
                   <div className="px-3">

                    <TaskItem
                      key={task.id}
                      isViewable={false}
                      task={task}
                      handleStatusChange={handleStatusChange}
                      handleDeleteTask={handleDeleteTask}
                      updateDueDate={updateDueDate}
                    />
                    </div>
                  ))
              ) : (
                <tr className="w-full">
                  <p  className="text-center dark:text-[#626F86]">
                    No items available
                  </p>
                </tr>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckList;
