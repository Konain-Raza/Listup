import React from "react";
import Dropdown from "./Dropdown";
import { format, parse } from "date-fns";
import useStore from "../Store";
import TaskDate from "./Date";
import Trash from "../assets/icons/trash";

const TaskItem = ({
  task,
  handleStatusChange,
  handleDeleteTask,
  isViewable,
  updateDueDate,
}) => {
  const { emails, me, siteAdmin } = useStore();
  const today = format(new Date(), "yyyy-MM-dd");

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const formattedDate = selectedDate
      ? format(new Date(selectedDate), "dd-MM-yyyy")
      : null;
    updateDueDate(task.id, formattedDate);
  };

  const showDatePicker =
    !isViewable && (siteAdmin || me.email === emails?.reporter);
  const dueDate = task.dueDate
    ? format(parse(task.dueDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")
    : "";

  return (
    <div
      key={task.id}
      className="flex items-center justify-between mb-3 w-full"
    >
      <div className="flex items-center gap-2 w-[80%] overflow-hidden">
        {!isViewable && (
          <label className="containere  dark:border-[#A6C5E229] border-[#091E4224] cursor-pointer ">
            <input
              checked={task.checked === "Done" || task.status === "Done"}
              type="checkbox"

              className="cursor-pointer dark:border-[#A6C5E229] border-[#091E4224] "
              onClick={(e) => {
                handleStatusChange(
                  task.id,
                  e.target.checked ? "Done" : "To Do"
                );
              }}
            />
            <span className="checkmark dark:border-[#A6C5E229] border-[#091E4224]"></span>
          </label>
        )}
        <Dropdown
          isViewable={isViewable}
          selected={task.status}
          handleStatusChange={handleStatusChange}
          taskId={task.id}
        />
        <h5
          className={`text-base w-max font-normal truncate overflow-hidden ${
            task.status === "Done"
              ? "line-through text-gray-500"
              : "text-gray-700"
          } dark:text-white`}
          onClick={() =>
            handleStatusChange(
              task.id,
              task.status === "Done" ? "To Do" : "Done"
            )
          }
          style={{ maxWidth: "100%" }}
        >
          {task.title || task.text}
        </h5>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-transparent">
          {showDatePicker ? (
            <input
              type="date"
              placeholder="Select a date" 
              id={`date-${task.id}`}
              name="dueDate"
              value={dueDate}
              min={today}
              onChange={handleDateChange}
              className="border rounded p-2 text-gray-700 dark:text-white dark:bg-darkBg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          ) : (
            task.dueDate && <TaskDate task={task} />
          )}
        </div>
        {!isViewable && (
          <button onClick={() => handleDeleteTask(task.id)}>
            <Trash />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
