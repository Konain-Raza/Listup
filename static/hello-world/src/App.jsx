import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckList from "./pages/Checklist";
import useStore from "./Store";
import { view, invoke } from "@forge/bridge";
import "./index.css";
import Templates from "./pages/Templates";
import View from "./pages/View";
const App = () => {
  const { setIssueKey, issueKey, setTasks, tasks, templates, setTemplates } =
    useStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const context = await view.getContext();
      setIssueKey(context.extension.issue.id);
      const currentIssueKey = context.extension?.issue?.id;
      if (!currentIssueKey) throw new Error("Issue key not found");
      console.log("issueKey", issueKey);
      const storedTasks = await invoke("getTasks", {
        issueKey: currentIssueKey,
      });
      const userData = await invoke("getMyself");
      const allTemplates = await invoke("getTemplates");
      setTasks(storedTasks || []);
      setTemplates({
        all: allTemplates || [],
        used: storedTasks?.map((task) => task.templateName) || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? (
    <div className="message message-info flex items-center justify-center dark:bg-darkBg">
      <span className="loading loading-infinity loading-lg"></span>
      <h2>Loading tasks...</h2>
    </div>
  ) : (
    <div className="overflow-x-hidden dark:bg-darkBg">
      <Routes>
        <Route
          path="/"
          element={
            <CheckList
              tasks={tasks}
              setTasks={setTasks}
              templates={templates}
              setTemplates={setTemplates}
            />
          }
        />
        <Route path="/templates" element={<Templates />} />
        <Route path="/view" element={<View />} />

      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
