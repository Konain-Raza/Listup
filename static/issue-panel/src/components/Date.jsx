import React from "react";
import { format, parse, isEqual } from "date-fns";

const TaskDate = ({ task }) => {
  // Get today's date in 'dd-MM-yyyy' format
  const todayFormatted = format(new Date(), "dd-MM-yyyy");

  // Parse task.dueDate to a Date object if it exists
  const taskDueDate =
    task.dueDate && task.dueDate.trim() !== ""
      ? parse(task.dueDate, "dd-MM-yyyy", new Date())
      : null;

  // Parse task.completedAt to a Date object if it exists
  const taskCompletedAt =
    task.completedAt && task.completedAt.trim() !== ""
      ? parse(task.completedAt, "dd-MM-yyyy", new Date())
      : null;

  // Determine the background color
  let backgroundColorClass;

  if (taskCompletedAt) {
    backgroundColorClass = "bg-[#DCFFF1] text-[#216E4E] dark:bg-[#1C3329] dark:text-[#7EE2B8]"; // Completed tasks
  } else if (taskDueDate && format(taskDueDate, "dd-MM-yyyy") === todayFormatted) {
    backgroundColorClass = "bg-[#FFECEB] text-[#AE2E24] dark:bg-[#42221F] dark:text-[#FD9891]"; // Due today
  } else {
    backgroundColorClass = "bg-[#E9F2FF] text-[#0055CC] dark:bg-[#1C2B41] dark:text-[#85B8FF]"; // Default state
  }

  // Display "No Due Date" if dueDate is empty or null
  const displayDate =
    task.dueDate && task.dueDate.trim() !== "" ? task.dueDate : "No Due Date";

  return (
    <button
      className={` p-1 px-2 rounded-md ${backgroundColorClass} overflow-hidden text-ellipsis whitespace-nowrap`}
      title={displayDate}
    >
      {displayDate}
    </button>
  );
};

export default TaskDate;
