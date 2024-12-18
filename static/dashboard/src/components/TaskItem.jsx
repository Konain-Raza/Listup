import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Trash from "../assets/icons/trash";

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
    <div key={task.id} className="w-max flex items-center justify-between pt-4">
      <div className="flex flex-grow items-center gap-4 w-max">
        <div className="w-max">
          <Dropdown
            isViewable={isViewable}
            selected={task.status}
            handleStatusChange={handleStatusChange}
            taskId={task.id}
          />
        </div>
        <div className="min-w-[505px] max-w-max">
          {isEditing && !isViewable ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              className="appearance-none dark:text-white bg-transparent text-sm w-full"
              autoFocus
              maxLength={100}
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className={`text-base ${
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
          <Trash />
        </button>
      )}
    </div>
  );
};

export default TaskItem;
