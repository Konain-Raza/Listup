import React from "react";

const PrimaryButton = ({ type = "button", onClick, label, keyType }) => {
  const colorStyles =
    keyType === "delete"
      ? "dark:text-red-500 dark:bg-[#411C1C] text-red-900 bg-red-100 border-red-900 hover:bg-red-200 focus:ring-red-300"
      : "dark:text-[#579DFF] dark:bg-[#1C2B41] text-blue-900 bg-blue-100 border-blue-900 hover:bg-blue-200 focus:ring-blue-300";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 flex w-max py-2 text-base gap-1 font-medium border rounded-md ml-2 focus:ring-4 focus:outline-none ${colorStyles}`}
    >
      <span>{label}</span>
    </button>
  );
};
export default PrimaryButton;
