import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import Settings from "./pages/Settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { invoke } from "@forge/bridge";
import useStore from "./Store";

const App = () => {
  const { templates, setTemplates, setMe, me, setSettings, settings } =
    useStore();
  const navigate = useNavigate();
  const [editTemplate, setEditTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run all requests in parallel using Promise.all
        const [userData, currentSettings, allTemplates] = await Promise.all([
          invoke("getMyself"),
          invoke("getSettings"),
          invoke("getTemplates"),
        ]);

        console.log("User data fetched:", userData);
        if (userData?.data) {
          setMe({
            name: userData.data.displayName || "Unknown User",
            email: userData.data.emailAddress || "No Email Provided",
            avatar: userData.data.avatarUrls?.["48x48"] || "default-avatar-url",
          });
        } else {
          throw new Error("User data is invalid or missing.");
        }

        console.log("Settings fetched:", currentSettings);
        if (currentSettings && typeof currentSettings === "object") {
          setSettings(currentSettings);
        } else {
          throw new Error("Settings data is invalid or missing.");
        }

        console.log("Templates fetched:", allTemplates);
        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates || []);
        } else {
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        console.error("Error during data fetch:", error);
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, [setMe, setSettings, setTemplates]);

  return (
    <div className="dark:bg-darkBg h-max min-h-screen">
      {/* Conditionally render based on loading */}
      {loading ? (
        <div>Loading...</div> // You can replace this with a spinner or loading indicator
      ) : (
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
          <Route
            path="/settings"
            element={<Settings owner={me} settings={settings} />}
          />
        </Routes>
      )}

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
