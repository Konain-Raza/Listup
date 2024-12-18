import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";

const AddItemForm = ({ handleAddItem }) => {
  const [item, setItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddItem({
      items: [{ title: item }],
      name: "Custom",
    });
    // e.target.reset();
    setItem("");
  };

  return (
    <form
      className="w-3/5  dark:border-[#A6C5E229]  mt-4 ml-1 mb-6 flex flex-col relative"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="item"
        className="dark:text-white block mb-2 text-lg font-medium text-gray-900"
      >
        Add a List Item <span className="text-red-500">*</span>
      </label>
      <div className="flex w-full items-center">
        <div className="relative w-full">
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            name="item"
            type="text"
            id="item"
            placeholder="Enter List Item"
            maxLength={100}
            className="pl-3 shadow-sm md:px-2 md:py-2 dark:bg-[#22272B] dark:border-[#A6C5E229] dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-16"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {item.length}/100
          </div>
        </div>
        <PrimaryButton
          label={"Add"}
          type="submit"
          keyType={"Add Item"}
          className={"px-4 md:px-4 py-2 md:py-2 border border-blue-900"}
        />
      </div>
    </form>
  );
};

export default AddItemForm;
