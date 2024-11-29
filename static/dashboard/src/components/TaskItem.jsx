import React, { useState } from "react";

const TaskItem = ({ task, handleStatusChange, handleDeleteTask, handleTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      handleTitleChange(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      key={task.id}
      className="w-full flex gap-3 items-center m-2 relative group"
    >
      {/* Status Dropdown */}
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(task.id, e.target.value)}
        className={`w-max border text-sm rounded-lg p-2.5 
          ${
            task.status === "To Do"
              ? "bg-gray-50 text-gray-900"
              : task.status === "In Progress"
              ? "bg-yellow-100 text-yellow-900"
              : task.status === "Done"
              ? "bg-green-100 text-green-900"
              : task.status === "Skipped"
              ? "bg-red-100 text-red-800"
              : ""
          }`}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
        <option value="Skipped">Skipped</option>
      </select>

      {/* Editable Title */}
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSaveEdit} // Save when losing focus
          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()} // Save on Enter
          className="p-1 border rounded text-sm flex-grow"
          autoFocus
        />
      ) : (
        <h5
          onClick={() => setIsEditing(true)} // Start editing on click
          className={`flex-grow cursor-pointer ${
            task.status === "Done" ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </h5>
      )}

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteTask(task.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;
