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
          setTemplates(allTemplates);
        } else {
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        toast.error("Error loading templates.");
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
  };

  return (
    <>
      {currentPage === "list" && (
        <>
          <button
            onClick={handleCreateTemplate}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
          >
            Create Template
          </button>
          <div className="relative flex min-h-screen flex justify-around flex-wrap bg-gray-50 py-6 sm:py-12">
            {templates.length > 0 ? (
              <div className="flex flex-wrap gap-6 justify-center">
                {templates.map((template) => (
                  <TemplateCard
                    me={owner}
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
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
