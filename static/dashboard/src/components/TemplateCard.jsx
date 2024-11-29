import React from "react";

const TemplateCard = ({ template, onEdit, onDelete, me }) => {
  return (
    <div
      key={template.id}
      className="group relative h-max w-72 cursor-pointer overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-max flex-col p-6">
        <div className="mb-4">
          <p className="text-xl font-semibold text-gray-800 truncate">
            {template.name}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
            {template.owner?.avatar ? (
              <img
                src={template.owner.avatar}
                alt={template.owner.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex items-center justify-center text-lg font-semibold text-gray-500">
                {template.owner?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {template.owner?.name || "Unknown Owner"}
            </span>
            <span className="text-xs text-gray-500">
              {template.owner?.email || "No Email Provided"}
            </span>
          </div>
        </div>
        {me.email && (
          <div className="flex gap-4">
            <button
              onClick={() => onEdit(template)}
              disabled={template.owner?.email !== me.email}
              className={`w-full py-2 text-center font-medium rounded-lg text-sm transition-colors duration-200 ${
                template.owner?.email !== me.email
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "text-white bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(template)}
              disabled={template.owner?.email !== me.email}
              className={`w-full py-2 text-center font-medium rounded-lg text-sm transition-colors duration-200 ${
                template.owner?.email !== me.email
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "text-white bg-red-600 hover:bg-red-700"
              }`}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
