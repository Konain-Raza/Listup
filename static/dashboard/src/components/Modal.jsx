import React, { useState } from "react";
import { toast } from "react-toastify";
import useStore from "../Store";
import { invoke } from "@forge/bridge";

export default function DeleteModal({ template, isOpen, setIsOpen }) {
  const { setTemplates, templates } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => setIsOpen(false);

  const handleDeleteTemplate = async () => {
    if (!template) return;

    setIsDeleting(true);
    try {
      const updatedTemplates = templates.filter((t) => t.id !== template.id);
      setTemplates(updatedTemplates);
      setIsOpen(false);
      const response = await invoke("setTemplates", {
        templates: updatedTemplates,
      });

      if (!response.success) {
        toast.error( "Failed to delete the template.");
      }
      
    } catch (error) {
      toast.error(`Error deleting checklist: ${error.message}`);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden">
      <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
        <div className="bg-white rounded-lg shadow dark:bg-[#282E33]">
          <div className="flex justify-between items-start p-5 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-2 mt-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.7664 3.98257C13.0093 4.08325 13.2301 4.23081 13.416 4.41682L19.584 10.5838C19.7702 10.7698 19.9179 10.9906 20.0186 11.2336C20.1194 11.4767 20.1713 11.7372 20.1713 12.0003C20.1713 12.2634 20.1194 12.524 20.0186 12.767C19.9179 13.0101 19.7702 13.2309 19.584 13.4168L13.416 19.5838C13.2301 19.7698 13.0093 19.9174 12.7664 20.0181C12.5234 20.1187 12.263 20.1706 12 20.1706C11.737 20.1706 11.4766 20.1187 11.2336 20.0181C10.9907 19.9174 10.7699 19.7698 10.584 19.5838L4.41601 13.4168C4.22985 13.2309 4.08216 13.0101 3.9814 12.767C3.88063 12.524 3.82877 12.2634 3.82877 12.0003C3.82877 11.7372 3.88063 11.4767 3.9814 11.2336C4.08216 10.9906 4.22985 10.7698 4.41601 10.5838L10.584 4.41682C10.7699 4.23081 10.9907 4.08325 11.2336 3.98257C11.4766 3.8819 11.737 3.83008 12 3.83008C12.263 3.83008 12.5234 3.8819 12.7664 3.98257ZM11.2929 13.7069C11.4804 13.8945 11.7348 13.9998 12 13.9998C12.2652 13.9998 12.5196 13.8945 12.7071 13.7069C12.8947 13.5194 13 13.265 13 12.9998V7.99982C13 7.7346 12.8947 7.48025 12.7071 7.29271C12.5196 7.10517 12.2652 6.99982 12 6.99982C11.7348 6.99982 11.4804 7.10517 11.2929 7.29271C11.1054 7.48025 11 7.7346 11 7.99982V12.9998C11 13.265 11.1054 13.5194 11.2929 13.7069ZM11.2929 16.7069C11.4804 16.8945 11.7348 16.9998 12 16.9998C12.2652 16.9998 12.5196 16.8945 12.7071 16.7069C12.8947 16.5194 13 16.265 13 15.9998C13 15.7346 12.8947 15.4802 12.7071 15.2927C12.5196 15.1052 12.2652 14.9998 12 14.9998C11.7348 14.9998 11.4804 15.1052 11.2929 15.2927C11.1054 15.4802 11 15.7346 11 15.9998C11 16.265 11.1054 16.5194 11.2929 16.7069Z"
                  fill="#C9372C"
                />
              </svg>
              <h3 className="text-2xl font-normal text-gray-900 dark:text-white m-0">
                Confirm Deletion
              </h3>
            </div>

            <button
              onClick={closeModal}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="p-6">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the checklist "{template.name}"? This
              action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-end p-6 space-x-2">
            <button
              onClick={closeModal}
              className="rounded-lg text-base px-5 py-2.5 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTemplate}
              className="bg-red-700 hover:bg-red-800 rounded-sm text-base text-white px-5 py-2.5 dark:bg-red-500 dark:hover:bg-red-700"
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
