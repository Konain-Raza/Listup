import React, { useState, useEffect } from "react";
import useStore from "../Store";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { invoke } from "@forge/bridge";
import PrimaryButton from "../components/PrimaryButton";

const Templates = () => {
  const navigate = useNavigate();
  const { templates, setTasks, tasks, issueKey, setTemplates } = useStore();

  const [selectedTemplates, setSelectedTemplates] = useState([]);

  useEffect(() => {
    console.log("Current used templates:", templates.used);
    console.log("Current tasks:", tasks);
    const usedTemplateNames = [
      ...new Set(
        tasks
          ?.filter((task) => task.templateName !== "Custom")
          .map((task) => task.templateName)
      ),
    ];
    setTemplates({
      all: templates.all || [],
      used: usedTemplateNames,
    });
    console.log("Current used templates:", templates.used);
  }, [templates, tasks]); // Effect runs on initial mount and whenever templates or tasks change

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

    const uniqueUsedTemplates = new Set([
      ...templates.used,
      ...selectedTemplates,
    ]);
    const updatedTemplates = {
      ...templates,
      used: Array.from(uniqueUsedTemplates),
    };
    setTemplates(updatedTemplates);

    const templatesToImport = templates.all.filter((template) =>
      selectedTemplates.includes(template.name)
    );

    const newTasks = templatesToImport.flatMap((template) =>
      template.items.map((item, i) => ({
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: item.title || `Task ${i + 1}`,
        status: item.status || "Done",
        checked: false,
        templateName: template.name,
      }))
    );

    const updatedTasks = [...newTasks, ...tasks];
    setTasks(updatedTasks);
    await invoke("setTasks", { issueKey, tasks: updatedTasks });

    toast.success(
      `${selectedTemplates.length} templates imported successfully!`
    );
    setSelectedTemplates([]);
  };

  const handleViewClick = (template) => {
    console.log("Viewing template:", template);
    navigate("/view", { state: { viewTemplate: template } });
  };

  return (
    <div className="dark:bg-darkBg">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-center dark:text-white">
          Templates
        </h2>
        <NavLink to="/">
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </NavLink>
      </div>

      <div className="flex flex-wrap gap-4 justify-start">
        {templates.all
          .filter((template) => template.name !== "Custom") // Filtering condition
          .map((template) => (
            <div
              key={template.name}
              className={`border border-gray-300 dark:border-[#A6C5E229] p-4 rounded-md w-full max-w-80 flex justify-between items-center gap-4 ${
                templates.used.includes(template.name)
                  ? "bg-[#091E4208] dark:bg-[#03040442] border-transparent"
                  : ""
              }`}
            >
              <div className="w-[80%] flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedTemplates.includes(template.name)}
                  onChange={() => handleCheckboxChange(template.name)}
                  disabled={templates.used.includes(template.name)}
                  className="h-5 w-5"
                />
                <span
                  className="text-md font-medium dark:text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis"
                  title={template.name}
                >
                  {template.name.length > 20
                    ? `${template.name.slice(0, 20)}...`
                    : template.name}
                </span>
              </div>
              <PrimaryButton
                label={"View"}
                keyType={"view"}
                className={`px-3 py-2 ${
                  templates.used.includes(template.name) &&
                  "dark:bg-[#091e420a]"
                }`}
                onClick={() => handleViewClick(template)}
                disabled={templates.used.includes(template.name)}
              />
            </div>
          ))}
      </div>

      <div className="text-left mt-6">
        <button
          onClick={handleImportTemplates}
          className="px-6 py-2 dark:bg-[#579DFF] dark:text-black text-base flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:hover:bg-blue-300 dark:focus:ring-blue-200"
        >
          Import Selected Templates
        </button>
      </div>
    </div>
  );
};

export default Templates;
