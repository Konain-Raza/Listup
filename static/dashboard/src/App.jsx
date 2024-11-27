import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/Modal";

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [saving, setIsSaving] = useState(false);
  const [subdmain, setEmail] = useState("");
  const [newList, setNewList] = useState({ name: "", items: [] });
  const [newListName, setNewListName] = useState("");
  const [newListItems, setNewListItems] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await invoke("getMyself");
        console.log(userData);

        const allTemplates = await invoke("getTemplates", {
          currentRoute: window.location.href,
        });

        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates);
          if (allTemplates.length === 0) {
            console.warn("No templates found.");
          }
        } else {
          console.error("Invalid templates data:", allTemplates);
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching user data or templates:", error);
        toast.error("Error loading templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!newListName.trim() || newList.items.length === 0) {
      toast.error("Please enter a list name and items.");
      setIsSaving(false);
      return;
    }

    const updatedList = { name: newListName.trim(), items: [...newList.items] };
    const allTemplates = [...templates, updatedList];
    setTemplates(allTemplates);
    setIsSaving(false);

    handleClear();

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: allTemplates,
      });

      if (response?.success) {
        toast.success("List saved successfully.");
      } else {
        toast.error("Failed to save the list.");
      }
    } catch {
      toast.error("Error saving the list.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteList = async (index) => {
    const confirmation = window.confirm(
      "Are you sure you want to clear that task?"
    );

    if (!confirmation) {
      return;
    }

    const updatedTemplates = templates.filter((_, i) => i !== index);
    setTemplates(updatedTemplates);

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: updatedTemplates,
      });

      if (response?.success) {
        toast.success("List deleted successfully.");
      } else {
        toast.error("Failed to delete the list.");
      }
    } catch {
      toast.error("Error deleting the list.");
    }
  };

  const handleClear = () => {
    setNewListName("");
    setNewListItems("");
    setNewList({ name: "", items: [] });
  };

  const addListItems = () => {
    if (!newListItems.trim()) {
      toast.error("Please enter an item.");
      return;
    }
    setNewList((prevList) => ({
      ...prevList,
      name: newListName.trim(),
      items: [
        ...prevList.items,
        { text: newListItems.trim(), status: "To Do", checked: false },
      ],
    }));
    setNewListItems(""); // clear item input after adding
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setIsModal(true);
  };

  return (
    <>
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title={selectedTemplate?.name || "Template Details"}
      >
        <h4 className="text-lg font-medium">Items:</h4>
        {selectedTemplate?.items?.length > 0 ? (
          <ul className="list-disc ml-5">
            {selectedTemplate.items.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        ) : (
          <p>No items available.</p>
        )}
      </Modal>

      <div className="container">
        <h1>Create a New List</h1>
        <div className="flex w-full">
          <form className="w-[40%] p-3 space-y-5">
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                List Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="mb-5 flex flex-col md:flex-row items-start justify-center space-y-2 md:space-y-0 md:space-x-4 mx-auto">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="text"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  List Item
                </label>
                <input
                  type="text"
                  value={newListItems}
                  onChange={(e) => setNewListItems(e.target.value)}
                  placeholder="Enter list item"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <button
                onClick={addListItems}
                type="button"
                className="self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex w-full gap-2 items-center justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {saving ? (
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
                    Loading...
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2 justify-center">
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
                        d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                      />
                    </svg>
                    <span>Save</span>
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                class="inline-flex justify-center  font-medium  text-sm px-5 py-2.5 text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                <span>Clear</span>
              </button>
            </div>
          </form>

          {newList.items.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 mx-auto mt-6">
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">
                List Items
              </h4>
              <ul
                className={`space-y-3 list-none pl-0 ${
                  newList.items.length >= 5 ? "grid grid-cols-2 gap-4" : ""
                }`}
              >
                {newList.items.map((item, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200 ease-in-out"
                  >
                    <span className="text-gray-700">{`${index + 1}. ${
                      item.text
                    }`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="templates">
          <h1>My Lists</h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 py-3 text-left">
                  S.No
                </th>

                <th scope="col" className="px-6 py-3 text-left">
                  Template Name
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="1" className="px-6 py-4 text-center"></td>
                  <div className="w-full flex justify-center items-center ">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </tr>
              ) : templates.length > 0 ? (
                templates.map((template, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-bold text-lg">
                      {template.name.length > 90
                        ? template.name.slice(0, 80) + "..."
                        : template.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewTemplate(template)}
                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
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
                      <button
                        onClick={() => handleDeleteList(index)}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
                    </td>
                  </tr>
                ))
              ) : (
                <div>No templates found</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
    </>
  );
};

export default App;