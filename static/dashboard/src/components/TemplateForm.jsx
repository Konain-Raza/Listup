import { useState, useEffect } from "react";
import "../index.css";
import TaskItem from "./TaskItem";
import { view, invoke } from "@forge/bridge";
import { toast } from "react-toastify";

function TemplateForm({ setTemplates, templates, template, onClose, owner }) {
  const [templateName, setTemplateName] = useState("");
  const [item, setItem] = useState("");
  const [newTemplate, setNewTemplate] = useState({ name: "", items: [] });
  const [saving, setIsSaving ] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Handle drag start
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // Handle drop event to reorder tasks
  const handleDrop = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null) return;

    // Clone items and reorder
    const updatedItems = [...newTemplate.items];
    const [movedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, movedItem);

    setNewTemplate((prevTemplate) => ({
      ...prevTemplate,
      items: updatedItems,
    }));

    setDraggedIndex(null); // Reset the dragged index
  };

  // Allow drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };


  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setNewTemplate({ name: template.name, items: template.items });
    } else {
      setTemplateName("");
      setNewTemplate({ name: "", items: [] });
    }
  }, [template]);

  const handleSave = async () => {
    setIsSaving(true);
    if (templateName && newTemplate.items.length > 0) {
      const templateToSave = { ...newTemplate, name: templateName, owner};
  
      let updatedTemplates;
  
      if (template) {
        // Update existing template
        updatedTemplates = templates.map((t) =>
          t.id === template.id ? { ...t, ...templateToSave } : t
        );
      } else {
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
        if (response?.success) toast.success("Template saved successfully.");
        else toast.error("Failed to save the template.");
      } catch (error) {
        toast.error("Error saving the template.");
      } finally {
        setIsSaving(false);
        setTemplateName("");
        setItem("");
        setNewTemplate({ name: "", items: [] });
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
          { id: Date.now(), title: item, checked: false, status: "To Do" },
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
    <div className="p-5 m-0">
      <button onClick={onClose}>back</button>
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
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
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
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </form>
        </div>

        <button
  type="button"
  onClick={handleSave}
  disabled={!templateName || (saving || newTemplate.items.length === 0)}
  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
>
  {saving ? "Saving" : "Save Template"}
</button>

      </div>

     <div className="mt-10">
      {newTemplate.items.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Current Template</h2>
          <div className="space-y-2">
            {newTemplate.items.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDrop={(event) => handleDrop(event, index)}
                onDragOver={handleDragOver}
                className="p-4 bg-white shadow-md rounded-md cursor-pointer"
              >
                <TaskItem
                  task={task}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTask}
                  handleTitleChange={handleTitleChange}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default TemplateForm;
