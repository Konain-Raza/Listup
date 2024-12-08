import React, { useState, useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import AddItemForm from "../components/AddItemForm";
import TaskItem from "../components/TaskItem";
import useStore from "../Store";
import { view, invoke } from "@forge/bridge";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const CheckList = () => {
  const { issueKey, tasks, setTasks, templates, setTemplates } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [completedTasksLength, setCompletedTasksLength] = useState(0);
  const [inputStatus, setInputStatus] = useState("To Do");

  useEffect(() => {
    setCompletedTasksLength(
      tasks.filter((task) => task.status === "completed").length
    );
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
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status, checked: status === "Done" } : task
    );
    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const groupedTasks = tasks.filter((task) => task.templateName !== "Custom");
  const customTasks = tasks.filter((task) => task.templateName === "Custom");

  return (
    <div>
      <div className="header">
        <div className="w-full flex justify-between items-center">
          <ProgressBar value={completedTasksLength} max={tasks.length} />
          <div className="w-max flex items-center">
            <NavLink to={"templates"}>
              <PrimaryButton
                label="Open Templates"
                keyType="templates"
                onClick={() => console.log("Open Templates")}
              />
            </NavLink>
            <PrimaryButton
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
            <div key={group.templateName}>
              <div className="text-left">
                <h5 className="font-bold text-xl border-b pb-2 flex justify-between items-center">
                  {group.templateName}
                  <button
                    // onClick={async () => {
                    //   if (
                    //     window.confirm(
                    //       `Are you sure you want to delete all tasks with the template "${group.templateName}"?`
                    //     )
                    //   ) {
                    //     try {
                    //       const updatedTasks = tasks.filter(
                    //         (task) => task.templateName !== group.templateName
                    //       );

                    //       setTemplates((prev) => ({
                    //         ...prev,
                    //         used: prev.used.filter(
                    //           (name) => name !== group.templateName
                    //         ),
                    //       }));

                    //       await invoke("setTasks", {
                    //         issueKey,
                    //         tasks: updatedTasks,
                    //       });
                    //       console.log("Updated==> " + updatedTasks);
                    //       setTasks(updatedTasks);

                    //       toast.success(
                    //         `All tasks with template "${group.templateName}" deleted successfully.`
                    //       );
                    //     } catch (error) {
                    //       toast.error(
                    //         `Failed to delete tasks: ${
                    //           error.message || "Unknown error"
                    //         }`
                    //       );
                    //     }
                    //   } else {
                    //     toast.info("Task deletion canceled.");
                    //   }
                    // }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete All
                  </button>
                </h5>
              </div>

              {group.tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTask}
                />
              ))}
              <hr />
            </div>
          ))}

        {
          <>
            {tasks.filter((task) => task.templateName === "Custom").length >
              0 && (
              <>
                <h3>Custom Tasks</h3>
                {tasks
                  .filter((task) => task.templateName === "Custom")
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      handleStatusChange={handleStatusChange}
                      handleDeleteTask={handleDeleteTask}
                    />
                  ))}
              </>
            )}
          </>
        }
      </div>
    </div>
  );
};

export default CheckList;
