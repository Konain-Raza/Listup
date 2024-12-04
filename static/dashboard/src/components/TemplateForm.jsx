import { useState, useEffect } from "react";
import "../index.css";
import TaskItem from "./TaskItem";
import { view, invoke } from "@forge/bridge";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

function TemplateForm({ setTemplates, templates, owner }) {
  const location = useLocation(); // Get location object
  const { template } = location.state || {}; // Retrieve template from state
  const [templateName, setTemplateName] = useState("");
  const [item, setItem] = useState("");
  const [description, setDescription] = useState(""); // Add description state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    items: [],
    description: "",
  });
  const [buttonText, setButtonText] = useState("Save Template");
  const [saving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setButtonText("Edit Template");
      setTemplateName(template.name);
      setDescription(template.description || ""); // Set description if exists
      setNewTemplate({
        name: template.name,
        items: template.items,
        description: template.description || "",
      });
    } else {
      setTemplateName("");
      setDescription(""); // Reset description
      setNewTemplate({ name: "", items: [], description: "" });
    }
  }, [template]);

  const handleSave = async () => {
    setIsSaving(true);
    if (templateName && newTemplate.items.length > 0) {
      const templateToSave = {
        ...newTemplate,
        name: templateName,
        owner,
        description: description || "",
      };
      console.log(templateToSave);

      let updatedTemplates;

      if (template) {
        setButtonText("Editing ...");

        // Update existing template
        updatedTemplates = templates.map((t) =>
          t.id === template.id ? { ...t, ...templateToSave } : t
        );
      } else {
        setButtonText("Saving ...");

        // Add new template
        updatedTemplates = [
          ...templates,
          { ...templateToSave, id: Date.now() },
        ];
      }

      setTemplates(updatedTemplates);

      try {
        const response = await invoke("setTemplates", {
          currentRoute: window.location.href,
          templates: updatedTemplates,
        });
        if (response?.success) {
          setButtonText("Editing ...");
          template
            ? setButtonText("Updated Template")
            : setButtonText("Saved Template");


        } else {
          toast.error("Failed to save the template.");
        }
      } catch (error) {
        toast.error("Error saving the template.");
      } finally {
        setIsSaving(false);
        setTemplateName("");
        setDescription(""); // Clear description after save
        setItem("");
        setNewTemplate({ name: "", items: [], description: "" });
      }
    } else {
      toast.error("Please provide a template name and at least one item.");
      setIsSaving(false);
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
    const updateStatus = (templateList) =>
      templateList.map((t) => ({
        ...t,
        items: t.items.map((item) =>
          item.id === taskId
            ? { ...item, status, checked: status === "Done" }
            : item
        ),
      }));

    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: prevTemplate.items.map((item) =>
        item.id === taskId
          ? { ...item, status, checked: status === "Done" }
          : item
      ),
    }));
    setTemplates((prevTemplates) => updateStatus(prevTemplates));
  };

  const handleTitleChange = (taskId, newTitle) => {
    const updateTitle = (templateList) =>
      templateList.map((t) => ({
        ...t,
        items: t.items.map((item) =>
          item.id === taskId ? { ...item, title: newTitle } : item
        ),
      }));

    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: prevTemplate.items.map((item) =>
        item.id === taskId ? { ...item, title: newTitle } : item
      ),
    }));
    setTemplates((prevTemplates) => updateTitle(prevTemplates));
  };

  const handleDeleteTask = async (taskId) => {
    const updatedItems = newTemplate.items.filter((item) => item.id !== taskId);

    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: updatedItems,
    }));

    const updatedTemplates = templates.map((t) =>
      t.id === newTemplate.id ? { ...t, items: updatedItems } : t
    );

    setTemplates(updatedTemplates);

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: updatedTemplates,
      });
      if (response?.success) toast.success("Task deleted successfully.");
      else toast.error("Failed to delete the task.");
    } catch (error) {
      toast.error("Error deleting the task.");
    }
  };

  return (
    <div className="px-4 m-0">
      <div className="w-full flex items-center justify-between py-4">
        {/* Heading */}
        <h1 className="text-3xl font-semibold">
          {template ? "Edit Template" : "Create Template"}
        </h1>
        <div className="flex gap-2 ">
          <button
            type="button"
            onClick={handleSave}
            disabled={!templateName || saving || newTemplate.items.length === 0}
            class="px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          <NavLink to="/" end>
            <button
              type="button"
              class="px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center"
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
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>

              <span>Go Back</span>
            </button>
          </NavLink>
        </div>
      </div>
      <div className="max-w-2xl">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Template Name
          </label>
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            name="name"
            type="text"
            id="name"
            maxLength={50}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {templateName.length}/50
          </div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            id="description"
            rows="4"
            maxLength={100}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <div className="text-sm text-gray-500 mt-1">
            {description.length}/100
          </div>
        </div>
        <div className="mt-5">
          <form className="border-t pt-5" onSubmit={handleAddItem}>
            <label
              htmlFor="item"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              List Item
            </label>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              name="item"
              type="text"
              id="item"
              maxLength={200}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <div className="text-sm text-gray-500 mt-1">{item.length}/200</div>
          </form>
        </div>
      </div>

      <div className="mt-10">
        {newTemplate.items.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Current Template</h2>
            <div className="w-full flex flex-col ">
              {newTemplate.items.map((task, index) => (
                <TaskItem
                  key={task.id || index}
                  task={task}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTask}
                  handleTitleChange={handleTitleChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateForm;
