import { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { toast, ToastContainer } from "react-toastify";
import {
  NavLink,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import useStore from "../Store";
import "../index.css";
import TaskItem from "../components/TaskItem";

function FormPage() {
  const { me, templates, setTemplates } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);

  const [templateName, setTemplateName] = useState("");
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    items: [],
    description: "",
  });
  const [buttonText, setButtonText] = useState("Save Template");
  const [saving, setIsSaving] = useState(false);

  useEffect(() => {
    const { template } = location.state || {};

    if (template) {
      setTemplate(template);
      setButtonText("Edit Template");
      setTemplateName(template.name);
      setDescription(template.description || "");
      setNewTemplate({
        id: template.id,
        name: template.name,
        items: template.items,
        description: template.description || "",
      });
    } else {
      setTemplateName("");
      setDescription("");
      setNewTemplate({ name: "", items: [], description: "" });
    }
  }, [location.state]);
  const handleTitleChange = (taskId, newTitle) => {
    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: prevTemplate.items.map((item) =>
        item.id === taskId ? { ...item, title: newTitle } : item
      ),
    }));
  };
  const handleSave = async () => {
    setIsSaving(true);
    console.log(" called");

    // Check if template name or items are missing
    if (!templateName || newTemplate.items.length === 0) {
      console.log(" in the ocndition");
      toast.error("Please provide a template name and at least one item.");
      setIsSaving(false); // Stop saving process if validation fails
      return; // Exit early to avoid further processing
    }
    const doesExist = templates.some(
      (t) =>
        t.name.trim() === templateName.trim() &&
        (!template || t.id !== template.id)
    );
    if (doesExist) {
      toast.error(
        "A template with this name already exists. Please use a different name."
      );
      setIsSaving(false);
      return;
    }
    // Prepare the template object to save
    const templateToSave = {
      ...newTemplate,
      name: templateName,
      description: description || "",
    };

    let updatedTemplates;

    try {
      if (template) {
        setButtonText("Editing ...");
        console.log("Editing template with ID:", template?.id);

        updatedTemplates = templates.map((t) => {
          console.log("Comparing template ID:", t.id, "with", template?.id);
          if (t.id === template?.id) {
            console.log("Template matched, updating template...");
            return {
              ...templateToSave,
              owner: template.owner,
              editedBy: me.name || "Edit By Someone",
            };
          }
          return t;
        });
      } else {
        setButtonText("Saving ...");
        console.log("Creating new template...");

        updatedTemplates = [
          ...templates,
          { ...templateToSave, id: Date.now(), owner: me },
        ];
      }

      console.log("Updated templates:", updatedTemplates);
      setTemplates(updatedTemplates);

      // Send the updated templates to the server
      const response = await invoke("setTemplates", {
        templates: updatedTemplates,
      });

      if (response?.success) {
        console.log("Template saved successfully:", response);
        setButtonText(template ? "Updated Template" : "Saved Template");
      } else {
        console.error("Failed to save the template.");
        toast.error("Failed to save the template.");
      }
    } catch (error) {
      console.error("Error saving the template:", error);
      toast.error("Error saving the template.");
    } finally {
      setIsSaving(false);
      if (template) {
        setButtonText("Edit Template");
      } else {
        resetForm();
        navigate("/");
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (item) {
      setNewTemplate((prevTemplate) => ({
        ...prevTemplate,
        items: [
          ...prevTemplate.items,
          {
            id: Date.now() + item,
            title: item,
            checked: false,
            status: "To Do",
          },
        ],
      }));
      setItem("");
    }
  };

  const handleStatusChange = (taskId, status) => {
    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: prevTemplate.items.map((item) => {
        if (item.id === taskId) {
          console.log(
            `Task ID ${item.id} matches ${taskId}, updating status to ${status}`
          );
          return { ...item, status, checked: status === "Done" };
        }
        return item;
      }),
    }));
  };

  const handleDeleteTask = async (taskId) => {
    console.log(taskId);
    const updatedItems = newTemplate.items.filter((item) => item.id !== taskId);

    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: updatedItems,
    }));
  };

  const resetForm = () => {
    setTemplateName("");
    setDescription("");
    setItem("");
    setNewTemplate({ name: "", items: [], description: "" });
  };

  return (
    <div className="w-full px-4 dark:bg-darkBg h-max min-h-screen">
      <div className="w-full flex items-center justify-between pt-4 pb-2 ">
        <h1 className={`dark:text-darkHeading font-semibold text-3xl`}>
          {template ? "Edit Template" : "Create Template"}
        </h1>

        <div className="flex gap-4 my-4 ">
          <button
            type="button"
            onClick={handleSave}
            className="dark:bg-[#579DFF] dark:text-black px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:hover:bg-blue-300 dark:focus:ring-blue-200"
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
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>{buttonText}</span>
          </button>

          <button
            type="button"
            className="dark:bg-[#A1BDD914] dark:text-white px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-center"
            onClick={() => navigate("/")}
          >
            <span>Go Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="mb-5 relative">
          <label
            htmlFor="name"
            className="dark:text-white block mb-2 text-xl font-medium text-gray-900"
          >
            Template Name <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              name="name"
              type="text"
              id="name"
              placeholder="Enter Template Name"
              maxLength={50}
              className="dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 pr-16"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {templateName.length}/50
            </div>
          </div>
        </div>

        <div className="mb-5 relative">
          <label
            htmlFor="description"
            className="dark:text-white block mb-2 text-xl font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            id="description"
            rows="2"
            maxLength={100}
            className="shadow-sm dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16"
          />
          <div className="absolute right-3 bottom-2 text-sm text-gray-500 z-10">
            {description.length}/100
          </div>
        </div>

        <form
          className="border-t  dark:border-[#A6C5E229] pt-10 mt-8 flex flex-col my-6 relative"
          onSubmit={handleAddItem}
        >
          <label
            htmlFor="item"
            className="dark:text-white block mb-2 text-xl font-medium text-gray-900"
          >
            Add a List Item <span className="text-red-500">*</span>
          </label>
          <div className="flex w-full items-center">
            <div className="relative w-full">
              <input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                name="item"
                type="text"
                id="item"
                placeholder="Enter List Item"
                maxLength={50}
                className="shadow-sm  dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {item.length}/50
              </div>
            </div>
            <button
              type="submit"
              className="px-5 flex w-max py-3 text-base gap-1 font-medium dark:text-[#579DFF]  dark:bg-[#1C2B41] text-blue-900 bg-blue-100 border border-blue-900 da hover:bg-blue-200 rounded-md ml-4"
            >
              <span>Add </span>
              <span>Item</span>
            </button>
          </div>
        </form>
      </div>
      <div className="w-full h-full">
        <table className="w-max table-fixed border-collapse dark:border-[#A6C5E229] rounded-xl h-auto">
          <thead>
            <tr className="row rounded-md">
              <th className="ml-2 dark:text-[#626F86]">List Item</th>
              <th className="ml-2 dark:text-[#626F86]">Status</th>
              <th className="ml-2 dark:text-[#626F86]">Action</th>
            </tr>
          </thead>
          <tbody className="dark:border-[#A6C5E229]">
            {newTemplate.items.length > 0 ? (
              (newTemplate.items.length > 0 && newTemplate.items).map(
                (task, index) => (
                  <TaskItem
                    isViewable={false}
                    key={task.id || index}
                    task={task}
                    handleStatusChange={handleStatusChange}
                    handleDeleteTask={handleDeleteTask}
                    handleTitleChange={handleTitleChange}
                  />
                )
              )
            ) : (
              <tr className="row">
                <td
                  colSpan={4}
                  className="text-left dark:text-[#626F86] w-[670px]"
                >
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormPage;
