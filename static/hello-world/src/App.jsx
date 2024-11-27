import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Badge from "@atlaskit/badge";

const App = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [issueKey, setIssueKey] = useState("");
  const [inputStatus, setInputStatus] = useState("To Do");
  const [textInput, setTextInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentRoute = window.location.href; 
        const match = currentRoute.match(/^([a-zA-Z0-9-]+)\.atlassian/);

        let subdomain = null;
        if (match) {
          subdomain = match[1];
          console.log("Extracted Subdomain:", subdomain);
        } else {
          console.error("No valid subdomain found in the route.");
        }
        const context = await view.getContext();
        const currentIssueKey = context.extension.issue.id;
        if (!currentIssueKey) throw new Error("Issue key not found.");
        setIssueKey(currentIssueKey);

        const [storedTasks, userData] = await Promise.all([
          invoke("getTasks", { issueKey: currentIssueKey }),
          invoke("getMyself"),
        ]);

        setTasks(storedTasks || []);
        // if (!userData?.emailAddress) throw new Error("User email not found.");

        const allTemplates = await invoke("getTemplates", {
          currentRoute: window.location.href,
        });

        setTemplates(Array.isArray(allTemplates) ? allTemplates : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleClearAllTasks = async () => {
    if (tasks.length === 0) {
      toast.warning("No tasks to clear.");
      return;
    }

    try {
      const confirmation = window.confirm(
        "Are you sure you want to clear all tasks?"
      );

      if (!confirmation) {
        return;
      }

      setTasks([]);

      await invoke("setTasks", { issueKey, tasks: [] });

      toast.success("All tasks have been cleared successfully!");
    } catch (error) {
      console.error("Error while clearing tasks:", error);
      toast.error("Failed to clear tasks.");
    }
  };

  const handleAddTask = async (template) => {
    if (!Array.isArray(template?.items) || template.items.length === 0) {
      toast.warning("No tasks in this template.");
      return;
    }

    const isEmpty = template.items.some((item, i) => {
      if (!item?.text) {
        toast.error(`Task is missing text.`);
        return true;
      }
      return false;
    });

    if (isEmpty) return;

    setTextInput("");
    if (!inputStatus) {
      toast.warning("Please select a status for the tasks.");
      return;
    }

    setIsAddingTask(true);

    try {
      const newTasks = template.items.map((item, i) => ({
        text: item?.text || `Task ${i + 1}`,
        status: inputStatus,
        checked: inputStatus === "Done",
      }));

      setTasks((prevTasks) => [...newTasks, ...prevTasks]);

      await invoke("setTasks", { issueKey, tasks: [...newTasks, ...tasks] });
      toast.success("Tasks added successfully!");
    } catch (error) {
      console.error("Error while adding tasks:", error);
      toast.error("Failed to add tasks.");
    } finally {
      setTextInput("");
      setInputStatus("To Do");
      setIsAddingTask(false);
    }
  };

  const handleStatusChange = async (index, status) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status, checked: status === "Done" } : task
    );
    setTasks(updatedTasks);

    try {
      await invoke("setTasks", { issueKey, tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update status.");
    }
  };

  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const totalTasks = tasks.length;
  const progressValue = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <div className="overflow-x-hidden">
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex="0"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-300"
          style={{ height: "100vh", width: "100vw" }}
        >
          <div className="p-5 rounded-lg max-w-md w-full border bg-white border-gray-300 shadow-2xl mt-4">
            {!isViewModalOpen ? (
              <div className="">
                <div className="flex justify-between items-center border-b pb-3 ">
                  <h3 className="text-xl font-semibold">Templates</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <h4>{template.name}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddTask(template)}
                          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2"
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
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsViewModalOpen(true);
                          }}
                          className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-2"
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
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xl font-semibold">
                    {selectedTemplate.name}
                  </h3>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  {selectedTemplate.items &&
                  selectedTemplate.items.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedTemplate.items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-800">
                          {item.text || `Item ${index + 1}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No items available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="message message-info flex items-center justify-center">
          <span className="loading loading-infinity loading-lg"></span>
          <h2>Tasks are rolling in...</h2>
        </div>
      ) : (
        <>
          <div className="header ">
            <div>
              <div className="flex gap-3 items-center">
                <div className="w-[53vw] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${progressValue * 100}%` }}
                  ></div>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Completed Tasks
                  <span class="inline-flex items-center justify-center w-max p-1 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                    {`${completedTasks}/${totalTasks}`}
                  </span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg inline-flex items-center gap-2 text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                    />
                  </svg>
                  Open Templates
                </button>
                <button
                  onClick={handleClearAllTasks}
                  type="button"
                  class=" inline-flex items-center  gap-1 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <form
            className="w-full max-w-4xl flex flex-col gap-6 dark:bg-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask({
                items: [{ text: textInput }],
                name: "Custom",
              });
            }}
          >
            <div className="w-full flex items-end gap-1">
              <div className="w-max">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <select
                  onChange={(e) => setInputStatus(e.target.value)}
                  className={`w-max border text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                >
                  <option value="To Do">Select Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Skipped">Skipped</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="task-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Task Name
                </label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter a task"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="flex justify-around items-center px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isAddingTask ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      class="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Adding...
                  </>
                ) : (
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {tasks.map((task, index) => (
            <div key={task.text + index}>
              <div className="w-full flex gap-3 items-center m-2">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={task.checked}
                  onChange={(e) =>
                    handleStatusChange(
                      index,
                      e.target.checked ? "Done" : "To Do"
                    )
                  }
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />

                <select
                  className={`w-max border text-sm rounded-lg p-2.5 
                    ${
                      task.status === "To Do"
                        ? "bg-gray-50 text-gray-900"
                        : task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-900"
                        : task.status === "Done"
                        ? "bg-green-100 text-green-900"
                        : task.status === "Skipped"
                        ? "bg-red-100 text-red-800"
                        : ""
                    } 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="To Do" className="bg-white text-black">
                    To Do
                  </option>
                  <option value="In Progress" className="bg-white text-black">
                    In Progress
                  </option>
                  <option value="Done" className="bg-white text-black">
                    Done
                  </option>
                  <option value="Skipped" className="bg-white text-black">
                    Skipped
                  </option>
                </select>

                <h5
                  className={
                    task.status === "Done" ? "line-through text-gray-500" : ""
                  }
                >
                  {task.text}
                </h5>
              </div>
              <hr />
            </div>
          ))}
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;