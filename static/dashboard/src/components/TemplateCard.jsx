import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../Store";
import { invoke } from "@forge/bridge";
import DeleteModal from "./Modal";
import Trash from "../assets/icons/trash";

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
        <div className="p-6 flex flex-col justify-between items-start h-full w-full">
          <div class="w-full mt-1 flex justify-between items-center ">
            <h1 class="text-xl font-semibold dark:text-white">
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

          <div className={`w-full flex overflow-hidden flex-col`}>
            <p class="text-gray-600 w-full truncate dark:text-gray-400 text-base mt-4 line-clamp-2 h-14 overflow-hidden">
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
                className={`dark:bg-[#A1BDD914] rounded-md px-6 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-900`}
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
              className={` py-2 text-sm flex justify-center items-center font-medium gap-1  ${
                me.email === template?.owner?.email
                  ? "text-red-600 hover:text-red-700 dark:text-[#F87168]"
                  : "text-gray-400 "
              }`}
              disabled={me.email !== template?.owner?.email}
              onClick={() => setIsOpen(true)}
            >
              <Trash />

              <span> Delete Checklist</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateCard;
