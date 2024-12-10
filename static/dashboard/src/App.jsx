import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { invoke } from "@forge/bridge";
import useStore from "./Store";
import View from "./pages/ViewPage";

const App = () => {
  const navigate = useNavigate();
  const { setTemplates, setMe, setSettings, setSiteAdmin } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await invoke("setTemplates", { templates: [] }); //for testing
        const [userData, isAdmin, currentSettings, allTemplates] =
          await Promise.all([
            invoke("getMyself"),
            invoke("checkAdminPermissions"),
            invoke("getSettings"),
            invoke("getTemplates"),
          ]);
        // Handle admin permissions
        const isAdminPermission =
          isAdmin?.permissions?.ADMINISTER?.havePermission;
        console.log("Admin Permissions:", isAdmin);

        // Update site admin status in Zustand store
        setSiteAdmin(isAdminPermission);

        console.log("Site Admin State Updated:", isAdminPermission);
        // Set the user data
        setMe({
          name: userData?.data?.displayName || "Unknown User",
          email: userData?.data?.emailAddress || "No Email Provided",
          avatar: userData?.data?.avatarUrls?.["48x48"] || "default-avatar-url",
        });

        // Handle settings
        if (currentSettings && typeof currentSettings === "object") {
          setSettings(currentSettings);
          console.log("Fetched settings:", currentSettings);
        } else {
          throw new Error("Settings data is invalid or missing.");
        }

        // Handle templates
        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates || []);
          console.log(allTemplates);
        } else {
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("Error loading data.");
      } finally {
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dark:bg-darkBg h-max min-h-screen">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route path="/" element={<Home loading={loading} />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/view" element={<View />} />

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
