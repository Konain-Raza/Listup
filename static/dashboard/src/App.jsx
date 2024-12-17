import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { invoke } from "@forge/bridge";
import useStore from "./Store";
import Spinner from "@atlaskit/spinner";
import View from "./pages/ViewPage";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
const App = () => {
  const navigate = useNavigate();
  const { setTemplates, setMe, setSettings, setSiteAdmin } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, isAdmin, currentSettings, allTemplates] =
          await Promise.all([
            invoke("getMyself"),
            invoke("checkAdminPermissions"),
            invoke("getSettings"),
            invoke("getTemplates"),
          ]);

        const isAdminPermission =
          isAdmin?.permissions?.ADMINISTER?.havePermission;
        setSiteAdmin(isAdminPermission);

        setMe({
          name: userData?.data?.displayName || "Unknown User",
          email: userData?.data?.emailAddress || "No Email Provided",
          avatar: userData?.data?.avatarUrls?.["48x48"] || "default-avatar-url",
        });

        if (currentSettings) {
          setSettings(currentSettings);
        } else {
          throw new Error("Failed to fetch settings.");
        }

        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates);
        } else {
          throw new Error("Failed to fetch templates.");
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dark:bg-darkBg h-max min-h-screen overflow-y-scroll scroll-hide">
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner size={"xlarge"} label="Loading" />
        </div>
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
