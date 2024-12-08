import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../Store";
import { invoke } from "@forge/bridge";

const TemplateCard = ({ template, setEditTemplate }) => {
  const { me, setTemplates, templates, settings } = useStore();
  const navigate = useNavigate();
  console.log("Templ===>", template);
  console.log("Me===>", me);
  console.log(settings);

  const handleEditTemplate = (template) => {
    if (template?.owner?.email === me?.email) {
      setEditTemplate(template);
      navigate("/form", { state: { template } });
    } else {
      toast.error("You do not have permission to edit this template.");
    }
  };
  const handleViewTemplate = (template) => {
    if (template?.owner?.email !== me?.email) {
      setEditTemplate(template);
      navigate("/form", { state: { viewTemplate: template } });
    } else {
      toast.error("You can directly edit this template.");
    }
    navigate("/form", { state: { viewTemplate: template } });
  };

  const handleDeleteTemplate = async (template) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    const updatedTemplates = templates.filter(
      (item) => item.id !== template.id
    );

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: updatedTemplates,
      });

      if (response.success) {
        setTemplates(updatedTemplates);
        toast.success("Template deleted successfully.");
      } else {
        toast.error("Failed to delete the template.");
      }
    } catch (error) {
      toast.error("Error deleting template.");
    }
  };

  return (
    <div className="w-full sm:w-[30rem] md:w-[35rem] lg:w-[40rem] dark:border-[#A6C5E229] border rounded-lg h-[250px] bg-white dark:bg-darkBg">
      <div className="px-4 sm:px-10 py-4 sm:py-7 flex flex-col justify-between items-start h-full w-full">
        <div className="w-full mt-1 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-white truncate">
            {template.name && template.name.length > 20
              ? template.name.slice(0, 20) + "..."
              : template.name}
          </h1>
          <div className="rounded-lg px-3 py-1 bg-[#E9F2FF] dark:bg-[#1C2B41]">
            <span className="text-blue-700 text-sm sm:text-base dark:text-[#579DFF]">
              Total Items: {template.items.length}
            </span>
          </div>
        </div>

        <div
          className={`flex overflow-hidden ${
            template.description.length > 0 ? "flex-col" : "flex-col-reverse"
          }`}
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-4 line-clamp-2 h-14 overflow-hidden">
            {template.description.length > 100
              ? template.description.slice(0, 120)
              : template.description || ""}
          </p>

          <div className="mt-2 text-sm sm:text-base">
            <span className="text-gray-400">Created by: </span>
            <span className="dark:text-white">
              {template.owner.name || "Konain"}
              {template?.owner?.email === me.email && "(You)"}
            </span>
          </div>
        </div>

        <div className="mt-4 w-full flex h-max justify-between items-center">
          <div className="w-max flex gap-1">
            <button
              className={`dark:bg-[#A1BDD914] rounded-md px-8 py-2 text-base font-medium 
    ${
      me.email === template?.owner?.email || settings?.allowTemplateEdit
        ? "text-black bg-gray-100 hover:bg-gray-300"
        : "text-gray-300 bg-gray-50 cursor-not-allowed"
    } 
    dark:text-white dark:hover:bg-gray-900`}
              onClick={() => {
                if (
                  me.email === template?.owner?.email ||
                  settings?.allowTemplateEdit
                ) {
                  handleEditTemplate(template);
                } else {
                  handleViewTemplate(template);
                }
              }}
            >
              {me.email === template?.owner?.email ||
              settings?.allowTemplateEdit
                ? "Edit"
                : "View"}
            </button>
          </div>

          <button
            className={`py-2 text-sm sm:text-base flex justify-center gap-2 font-medium ${
              me.email === template?.owner?.email
                ? "text-red-600 hover:text-red-700 dark:text-[#F87168]"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={me.email !== template?.owner?.email}
            onClick={() => handleDeleteTemplate(template)}
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

            <span> Delete Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
