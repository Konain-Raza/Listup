import { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../Store";
import "../index.css";
import TaskItem from "../components/TaskItem";
import PrimaryButton from "../components/PrimaryButton";

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
  const [buttonText, setButtonText] = useState("Save Checklist");

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
    if (!templateName || newTemplate.items.length === 0) {
      toast.error("Please provide a checklist name and at least one item.");
      return;
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
      return;
    }
    const isAllDone = newTemplate.items.every((task) => {
      console.log(task); // This will log each task object to the console
      return task.status === "Done"; // Important: return the condition check
    });

    console.log('All tasks are marked as "Done":', isAllDone); // This will output whether all tasks are "Done"

    if (isAllDone) {
      toast.error(
        "All list items cannot be marked as 'Done' when creating a new checklist"
      );
      return;
    }
    const templateToSave = {
      ...newTemplate,
      name: templateName,
      description: description || "",
    };

    let updatedTemplates;

    try {
      if (template) {
        setButtonText("Editing ...");

        updatedTemplates = templates.map((t) => {
          if (t.id === template?.id) {
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

        updatedTemplates = [
          ...templates,
          { ...templateToSave, id: Date.now(), owner: me },
        ];
      }

      setTemplates(updatedTemplates);

      const response = await invoke("setTemplates", {
        templates: updatedTemplates,
      });

      if (response?.success) {
        setButtonText(template ? "Updated Checklist" : "Saved Checklist");
      } else {
        toast.error("Failed to save the template.");
      }
    } catch (error) {
      toast.error("Error saving the template.");
    } finally {
      if (template) {
        setButtonText("Edit Checklist");
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
    console.log(taskId, status);
    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: prevTemplate.items.map((item) => {
        if (item.id === taskId) {
          return { ...item, status, checked: status === "Done" };
        }
        return item;
      }),
    }));
  };

  const handleDeleteTask = async (taskId) => {
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
      <div className="w-full flex items-center justify-between py-4 ">
        <h1 className={`dark:text-darkHeading font-semibold text-2xl`}>
          {template ? "Edit Checklist" : "Create Checklist"}
        </h1>

        <div className="flex gap-4 my-4 ">
          <button
            type="button"
            onClick={handleSave}
            className="dark:bg-[#579DFF] dark:text-black px-4 py-3 text-sm items-center flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md text-center dark:hover:bg-blue-300 dark:focus:ring-blue-200"
          >
            <span>{buttonText}</span>
          </button>

          <button
            type="button"
            className="dark:bg-[#A1BDD914] dark:text-white px-4 py-3 text-sm flex justify-center gap-2 items-center font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-md text-center"
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
            className="dark:text-white block mb-2 text-l font-medium text-gray-900"
          >
            Checklist Name <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              name="name"
              type="text"
              id="name"
              placeholder="Enter Checklist Name"
              maxLength={50}
              className="dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 pr-16"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {templateName.length}/50
            </div>
          </div>
        </div>

        <div className="mb-8 relative">
          <label
            htmlFor="description"
            placeholder="Enter a Description"
            className="dark:text-white block mb-2 text-l font-medium text-gray-900"
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
            className="resize-none shadow-sm dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16"
          />
          <div className="absolute right-3 bottom-2 text-sm text-gray-500 z-10">
            {description.length}/100
          </div>
        </div>

        <form
          className="border-t pt-5 dark:border-[#A6C5E229] mt-5 flex flex-col relative"
          onSubmit={handleAddItem}
        >
          <label
            htmlFor="item"
            className="dark:text-white block mb-2 text-left font-medium text-gray-900"
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
                maxLength={100}
                className="shadow-sm dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-3.5 py-2 pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {item.length}/100
              </div>
            </div>
            <PrimaryButton
              label={"Add"}
              type="submit"
              keyType={"Add Item"}
              className={"px-4 md:px-4 py-2 md:py-2 border border-blue-900"}
            />
          </div>
        </form>
      </div>
      <div className="w-full h-full">
        {newTemplate.items.length > 0 &&
          newTemplate.items.map((task, index) => (
            <TaskItem
              isViewable={false}
              key={task.id || index}
              task={task}
              handleStatusChange={handleStatusChange}
              handleDeleteTask={handleDeleteTask}
              handleTitleChange={handleTitleChange}
            />
          ))}
      </div>
    </div>
  );
}

export default FormPage;
