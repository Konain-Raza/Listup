import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

const TaskItem = ({
  task,
  handleStatusChange,
  handleDeleteTask,
  isViewable,
  handleTitleChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      handleTitleChange(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div key={task.id} className="w-max flex items-center justify-between py-4">
      <div className="flex flex-grow items-center gap-1 w-max">
        <div className="w-[110px]">
          <Dropdown
            isViewable={isViewable}
            selected={task.status}
            handleStatusChange={handleStatusChange}
            taskId={task.id}
          />
        </div>
        <div className="min-w-[520px] max-w-max">
          {isEditing && !isViewable ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveEdit} 
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()} 
              className="p-3 dark:text-white bg-transparent text-sm flex-grow w-full"
              autoFocus
              maxLength={100}
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)} 
              className={`text-base flex-grow ${
                isViewable ? "cursor-default" : "cursor-pointer"
              } dark:text-white ${
                task.status === "Done"
                  ? "line-through text-gray-500 dark:text-white"
                  : ""
              }`}
            >
              {task.title}
            </p>
          )}
        </div>
      </div>

      {!isViewable && (
        <button onClick={() => handleDeleteTask(task.id)} className="ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TaskItem;
