import React from "react";

const TaskItem = ({ task, handleStatusChange, handleDeleteTask }) => {
  return (
    <div
      key={task.text + task.id}
      className="w-full flex gap-3 items-center m-2 relative group"
    >
      <input
        type="checkbox"
        checked={task.checked}
        onChange={(e) =>
          handleStatusChange(task.id, e.target.checked ? "Done" : "To Do")
        }
        className="w-4 h-4"
      />
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
      <h5
        className={
          task.status === "Done" ? "line-through text-gray-500" : ""
        }
      >
        {task.text}
      </h5>
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
