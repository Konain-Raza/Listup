import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../Store";
import { invoke } from "@forge/bridge";
import DeleteModal from "./Modal";

const TemplateCard = ({ template }) => {
  const { me, settings, siteAdmin } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditTemplate = (template) => {
    navigate("/form", { state: { template } });
  };
  const handleViewTemplate = (template) => {
    navigate("/view", { state: { viewTemplate: template } });
  };

  return (
    <>
      <DeleteModal isOpen={isOpen} setIsOpen={setIsOpen} template={template} />
      <div className="w-full dark:border-[#A6C5E229] border rounded-lg h-[250px] bg-white dark:bg-darkBg ">
        <div className="px-10 py-7 flex flex-col justify-between items-start h-full w-full">
          <div class="w-full mt-1 flex justify-between items-center ">
            <h1 class="text-2xl font-semibold dark:text-white">
              {template.name.charAt(0).toUpperCase() +
                (template.name.length > 20
                  ? template.name.slice(1, 20) + "..."
                  : template.name.slice(1))}
            </h1>
            <div class="rounded-lg px-3 py-1 mb-2 bg-[#E9F2FF] dark:bg-[#1C2B41]">
              <span class="text-blue-700 text-base dark:text-[#579DFF]">
                Total Items: {template.items.length}
              </span>
            </div>
          </div>

          <div className={` flex overflow-hidden flex-col`}>
            <p class="text-gray-600 dark:text-gray-400 text-base mt-4 line-clamp-2 h-14 overflow-hidden">
              {template.description.length > 100
                ? template.description.slice(0, 120)
                : template.description || ""}
            </p>

            <div class="mt-2 text-base">
              <span class="text-gray-400 ">
                {template.editedBy ? `Edited By: ` : "Created By: "}
              </span>
              <span className="dark:text-white">
                {template.editedBy
                  ? template.editedBy
                  : `${template.owner?.name || "Konain"}${
                      template?.owner?.email === me.email ? " (You)" : ""
                    }`}
              </span>
            </div>
          </div>

          <div class="mt-4 w-full flex h-max justify-between items-center">
            <div className="w-max flex gap-1">
              <button
                className={`dark:bg-[#A1BDD914] rounded-md px-8 py-2 text-base font-medium text-black bg-gray-100 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-900`}
                onClick={() =>
                  me.email === template?.owner?.email ||
                  settings?.allowTemplateEdit ||
                  siteAdmin == true
                    ? handleEditTemplate(template)
                    : handleViewTemplate(template)
                }
              >
                {me.email === template?.owner?.email ||
                settings?.allowTemplateEdit ||
                siteAdmin == true
                  ? "Edit"
                  : "View"}
              </button>
            </div>

            <button
              className={` py-2 text-base flex justify-center gap-2 font-medium ${
                me.email === template?.owner?.email
                  ? "text-red-600 hover:text-red-700 dark:text-[#F87168]"
                  : "text-gray-400 "
              }`}
              disabled={me.email !== template?.owner?.email}
              onClick={() => setIsOpen(true)}
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

              <span> Delete Checklist</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateCard;
