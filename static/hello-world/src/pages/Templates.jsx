import React, { useState } from "react";
import useStore from "../Store";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { invoke } from "@forge/bridge";
import PrimaryButton from "../components/PrimaryButton";
const Templates = () => {
  const navigate = useNavigate();
  const { templates, setTasks, tasks, issueKey } = useStore();
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const handleCheckboxChange = (templateName) => {
    setSelectedTemplates((prevSelected) =>
      prevSelected.includes(templateName)
        ? prevSelected.filter((name) => name !== templateName)
        : [...prevSelected, templateName]
    );
  };

  const handleImportTemplates = async () => {
    if (!selectedTemplates.length) {
      toast.warning("Please select at least one template to import.");
      return;
    }

    const templatesToImport = templates.all.filter((template) =>
      selectedTemplates.includes(template.name)
    );

    const newTasks = templatesToImport.flatMap((template) =>
      template.items.map((item, i) => ({
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: item.title || `Task ${i + 1}`,
        status: "To Do",
        checked: false,
        templateName: template.name,
      }))
    );
    console.log(newTasks);
    console.log(issueKey)
    const updatedTasks = [...newTasks, ...tasks];
    setTasks(updatedTasks);

    await invoke("setTasks", { issueKey, tasks: updatedTasks });

    toast.success(
      `${selectedTemplates.length} templates imported successfully!`
    );
    setSelectedTemplates([]); // Clear selection after import
  };
  const handleViewClick = (template) => {
    // Assuming `template` is your viewTemplate data
    console.log(template);
    navigate("/view", { state: { viewTemplate: template } });
  };
  return (
    <div className="dark:bg-darkBg p-4">
      <h2 className="text-lg font-bold text-center mb-4">Templates</h2>
      <NavLink to={"/"}>
        <button>back</button>
      </NavLink>
      <div className="flex flex-wrap gap-4 justify-center">
        {templates.all.map((template) => (
          <div
            key={template.name}
            className="border border-gray-300 p-4 rounded-md shadow-md w-full max-w-64 flex justify-between items-center gap-4"
          >
            <input
              type="checkbox"
              checked={selectedTemplates.includes(template.name)}
              onChange={() => handleCheckboxChange(template.name)}
              className="h-5 w-5"
            />
            <span className="text-md font-medium">{template.name}</span>
            <PrimaryButton
      label={"View"}
      keyType={"view"}
      onClick={() => handleViewClick(template)} // Use an arrow function to pass the template
    />
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleImportTemplates}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700"
        >
          Import Selected Templates
        </button>
      </div>
    </div>
  );
};

export default Templates;
