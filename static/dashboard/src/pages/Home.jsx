import React, { useState } from "react";
import TemplateCard from "../components/TemplateCard";
import { NavLink, useNavigate } from "react-router-dom";
import Drawer from "../components/Drawer";
import useStore from "../Store";
import "../index.css";

const Home = ({ loading }) => {
  const { templates, siteAdmin } = useStore();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };
  return (
    <>
      <Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <div className="w-full px-4 dark:bg-[#1D2125] overflow-y-scroll scrollbar-hide ">
        <div className="w-full flex items-center justify-between py-4">
          <h1 className="text-3xl font-semibold dark:text-darkHeading">
            Checklists
          </h1>

          <div className="flex gap-4 my-4 ">
            <button
              type="button"
              className="dark:bg-[#579DFF] dark:text-black px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:hover:bg-blue-300 dark:focus:ring-blue-200"
              onClick={() => navigate("/form")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add a New Checklist</span>
            </button>

            {siteAdmin === true && (
              <button
                onClick={toggleDrawer}
                type="button"
                data-drawer-target="drawer-example"
                data-drawer-show="drawer-example"
                aria-controls="drawer-example"
                className="dark:bg-[#A1BDD914] dark:text-white px-6 py-3.5 text-base flex justify-center gap-2 font-medium text-gray-800 bg-gray-100 hover:bg-gray-200  dark:hover:bg-gray-900 rounded-lg text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span>Settings</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative flex  flex-wrap py-2">
          {loading ? (
            <div className="flex flex-row items-center justify-center w-full">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 w-full overflow-hidden">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 w-full overflow-hidden">
              <div
                className="w-full border flex flex-col items-center rounded-lg h-[250px] bg-blue-100 dark:bg-[#1C2B41] dark:border-[#A6C5E229]"
                onClick={() => navigate("/form")}
              >
                <div className="px-10 py-7 flex flex-col justify-center items-center h-full w-full">
                  <button
                    className="text-blue-700 dark:text-[#579DFF] text-2xl py-2 px-4 rounded-lg"
                    onClick={() => navigate("/form")}
                  >
                    + Add a New Checklist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
