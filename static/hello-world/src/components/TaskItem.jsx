import React from "react";
import Dropdown from "./Dropdown";

const TaskItem = ({
  task,
  handleStatusChange,
  handleDeleteTask,
  isViewable,
}) => {
  return (
    <tr key={task.id} className="row ">
      {!isViewable && (
        <td className="w-[5%] text-gray-700">
          <input
            type="checkbox"
            checked={task.checked}
            onChange={(e) =>
              handleStatusChange(task.id, e.target.checked ? "Done" : "To Do")
            }
            className="w-4 h-4"
          />
        </td>
      )}
      <td className={`${isViewable ? "w-[60%]" : "w-[70%]"} max-w-max text-gray-700`}>
        <h5
          className={task.status === "Done" ? "line-through text-gray-700" : ""}
        >
          {task.title || task.text}
        </h5>
      </td>
      <td
        className={`${
          isViewable ? "w-[40%]" : "w-[30%]"
        } max-w-max text-center`}
      >
        <Dropdown
          isViewable={isViewable}
          selected={task.status}
          handleStatusChange={handleStatusChange}
          taskId={task.id}
        />
      </td>

      {!isViewable && (
        <td className="w-[15%] text-left text-gray-700">
          <button onClick={() => handleDeleteTask(task.id)}>
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
        </td>
      )}
    </tr>
  );
};

export default TaskItem;
