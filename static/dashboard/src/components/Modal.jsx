import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
    id="default-modal"
    tabIndex="0"
    aria-hidden={!isOpen}
    className={`fixed inset-0 z-50 flex justify-center items-start transition-opacity duration-[2000] ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
      <div className="bg-white p-5 rounded-lg max-w-md w-full border border-gray-200 shadow-2xl mt-24">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold">{title || "Modal Title"}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
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
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
