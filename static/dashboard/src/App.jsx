import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { invoke } from "@forge/bridge";
import useStore from "./Store";
import Settings from "./pages/Settings";

const App = () => {
  const { templates, setTemplates, setMe, me, setSettings, settings } =
    useStore();
  const [editTemplate, setEditTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await invoke("getMyself");
        console.log(userData?.data?.groups?.items)
        setMe({
          name: userData?.data?.displayName || "Unknown User",
          email: userData?.data?.emailAddress || "No Email Provided",
          avatar: userData?.data?.avatarUrls?.["48x48"] || "default-avatar-url",
        });
        const currentSettings = await invoke("getSettings", {
          currentRoute: window.location.href,
        });

        if (currentSettings && typeof currentSettings === "object") {
          setSettings(currentSettings);
          console.log("Fetched settings:", currentSettings);
        } else {
          throw new Error("Settings data is invalid or missing.");
        }

        const allTemplates = await invoke("getTemplates", {
          currentRoute: window.location.href,
        });

        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates || []);
          console.log(allTemplates);
        } else {
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        toast.error("Error loading templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" dark:bg-darkBg h-max min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              owner={me}
              loading={loading}
              setEditTemplate={setEditTemplate}
              setTemplates={setTemplates}
            />
          }
        />
        <Route
          path="/form"
          element={
            <FormPage
              owner={me}
              templates={templates}
              setTemplates={setTemplates}
              editTemplate={editTemplate}
            />
          }
        />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
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
