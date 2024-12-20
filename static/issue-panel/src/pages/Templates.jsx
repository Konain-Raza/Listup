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
    const usedTemplateNames = Array.from(
      new Set(
        tasks
          ?.filter(
            (task) => task.templateName && task.templateName !== "Custom"
          )
          .map((task) => task.templateName)
      )
    );

    setTemplates({
      all: templates.all || [],
      used:
        usedTemplateNames.length > 0
          ? Array.from(new Set(usedTemplateNames))
          : [],
    });
  }, [tasks, setTemplates]);

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

    setSelectedTemplates([]);
    navigate("/");
  };

  const handleViewClick = (template) => {
    navigate("/view", { state: { viewTemplate: template } });
  };

  return (
    <div className="dark:bg-darkBg border-none dark:border-[#A6C5E229] w-full h-max rounded-md dark:border">
      <div className="w-full flex justify-between items-center mb-4 pt-4">
        <h2 className="text-lg text-center dark:text-white">Checklists</h2>
        <NavLink to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 dark:text-darkHeading text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </NavLink>
      </div>

      {templates && templates.all && templates.all.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-start">
          {templates.all
            .filter((template) => template.name !== "Custom")
            .map((template) => (
              <div
                onClick={() =>
                  !templates.used.includes(template.name) &&
                  handleCheckboxChange(template.name)
                }
                key={template.name}
                className={`border border-gray-300 dark:border-[#A6C5E229] p-3 rounded-md w-full max-w-80 flex justify-between items-center gap-4 ${
                  templates.used.includes(template.name)
                    ? "bg-[#091E4208] dark:bg-[#03040442] border-transparent"
                    : ""
                }`}
              >
                <div className="w-[80%] flex gap-2 items-center">
                  <label
                    className={`${
                      templates.used.includes(template.name)
                        ? "cursor-default"
                        : "cursor-pointer"
                    } containere w-8 h-max dark:border-[#A6C5E229] border-[#091E4224] `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.name)}
                      onChange={() => handleCheckboxChange(template.name)}
                      disabled={templates.used.includes(template.name)}
                      className={`${
                        templates.used.includes(template.name)
                          ? "cursor-default"
                          : "cursor-pointer"
                      } w-5 h-5 dark:border-[#A6C5E229] border-[#091E4224] `}

                    />
                    <span className="checkmark dark:border-[#A6C5E229] border-[#091E4224]"></span>
                  </label>
                  <span
                    className="text-md font-medium dark:text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis"
                    title={template.name}
                  >
                    {template.name.charAt(0).toUpperCase() +
                      (template.name.length > 20
                        ? template.name.slice(1, 20) + "..."
                        : template.name.slice(1))}
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
      ) : (
        <p className="text-black dark:text-white">No Checklists</p>
      )}

      <div className="text-left mt-6">
        <button
          onClick={handleImportTemplates}
          className="px-3 py-2 dark:bg-[#579DFF] dark:text-black text-sm flex justify-center gap-2 font-medium text-white bg-jiraBlue hover:bg-blue-800 rounded-md text-center dark:hover:bg-blue-300"
        >
          Add Checklist
        </button>
      </div>
    </div>
  );
};

export default Templates;
