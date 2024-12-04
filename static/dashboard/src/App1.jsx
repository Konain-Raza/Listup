import React, { useEffect, useState } from "react";
import TemplateForm from "./components/TemplateForm";
import TemplateCard from "./components/TemplateCard"; // Import TemplateCard
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { invoke } from "@forge/bridge";

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [owner, setOwner] = useState(null);
  const [currentPage, setCurrentPage] = useState("list");
  const [editTemplate, setEditTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await invoke("getMyself");
        setOwner({
          name: userData?.data?.displayName || "Unknown User",
          email: userData?.data?.emailAddress || "No Email Provided",
          avatar: userData?.data?.avatarUrls?.["48x48"] || "default-avatar-url",
        });

        const allTemplates = await invoke("getTemplates", {
          currentRoute: window.location.href,
        });

        if (Array.isArray(allTemplates)) {
          console.log(allTemplates)
          setTemplates(allTemplates);
        } else {
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        toast.error("Error loading templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTemplate = async (template) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return; // Exit the function if the user cancels.
    }

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

  const handleCreateTemplate = () => {
    setCurrentPage("create");
    setEditTemplate(null);
  };

  const handleEditTemplate = (template) => {
    setCurrentPage("edit");
    setEditTemplate(template);
  };

  const handleCloseForm = () => {
    setCurrentPage("list");
    setEditTemplate(null);
    setSelectedTemplate(null);
  };

  const handleViewModal = (template) => {
    setCurrentPage("view");
    setSelectedTemplate(template);
  };
  return (
    <>
      {currentPage === "list" && (
        <>
          <div className="w-full justify-between flex flex-row">

            <h1>Templates</h1>
          <button
            onClick={handleCreateTemplate}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
          >
            Create Template
          </button>
          </div>
          <div className="relative flex min-h-screen flex-wrap bg-gray-50 py-6 sm:py-12">
            {loading ? (
              <div className="flex flex-row items-center justify-center w-full">
                <span className="loading loading-infinity loading-lg"></span>
              </div>
            ) : templates.length > 0 ? (
              <div className="flex flex-wrap gap-6 justify-center">
                {templates.map((template) => (
                  <TemplateCard
                    me={owner}
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onViewModal={handleViewModal}
                    onClose={handleCloseForm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No templates found
              </div>
            )}
          </div>
        </>
      )}
      {currentPage === "view" && selectedTemplate && (
        <div className="mt-6">
          <button onClick={handleCloseForm}>
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h3 className="text-xl font-bold">
            Items in {selectedTemplate.name}:
          </h3>
          <ul className="list-disc pl-6">
            {selectedTemplate.items.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.title || "Task"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(currentPage === "create" || currentPage === "edit") && (
        <TemplateForm
          owner={owner}
          templates={templates}
          setTemplates={setTemplates}
          template={editTemplate}
          onClose={handleCloseForm}
          isEditMode={currentPage === "edit"}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
