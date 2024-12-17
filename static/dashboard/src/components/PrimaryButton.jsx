import React from "react";

const PrimaryButton = ({
  type = "button",
  onClick,
  label,
  keyType,
  className,
}) => {
  const colorStyles =
    keyType === "delete"
      ? "dark:text-red-500 dark:bg-[#411C1C] text-red-900 bg-red-100 hover:bg-red-200 dark:hover:bg-darkRedBgHover dark:hover:text-darkRedTextHover"
      : "text-blue-900 bg-blue-100 dark:text-[#579DFF] dark:bg-[#1C2B41] hover:bg-blue-200 dark:hover:bg-darkBlueBgHover dark:hover:text-darkBlueTextHover";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} flex w-max text-base gap-1 font-medium rounded-md ml-2 ${colorStyles} no-underline`}
    >
      <p className="m-0 no-underline hover:no-underline">{label}</p>
    </button>
  );
};
export default PrimaryButton;
