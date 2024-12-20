import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckList from "./pages/Checklist";
import Templates from "./pages/Templates";
import View from "./pages/View";
import useStore from "./Store";
import { view, invoke } from "@forge/bridge";
import "./index.css";
import Spinner from "@atlaskit/spinner";
import Warning from "./assets/icons/warning";
import WarningMessage from "./components/NoPermission";

const App = () => {
  const navigate = useNavigate();
  const {
    setIssueKey,
    setSettings,
    setTasks,
    setTemplates,
    setSiteAdmin,
    setEmails,
    setMe,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const context = await view.getContext();
      const currentIssueKey = context.extension?.issue?.id;
      if (!currentIssueKey) throw new Error("Issue key not found");

      setIssueKey(currentIssueKey);

      const [
        ticketDetails,
        storedTasks,
        userData,
        allTemplates,
        adminPermissions,
        allSettings,
      ] = await Promise.all([
        invoke("getTicketDetails", { ticketId: currentIssueKey }),
        invoke("getTasks", { issueKey: currentIssueKey }),
        invoke("getMyself"),
        invoke("getTemplates"),
        invoke("checkAdminPermissions"),
        invoke("getSettings"),
      ]);
      setEmails({
        assignee: ticketDetails.fields.assignee.emailAddress,
        creator: ticketDetails.fields.creator.emailAddress,
        reporter: ticketDetails.fields.reporter.emailAddress,
      });
      const isAllowed =
        [
          ticketDetails.fields.assignee.emailAddress,
          ticketDetails.fields.creator.emailAddress,
          ticketDetails.fields.reporter.emailAddress,
        ].includes(userData.data.emailAddress) ||
        allSettings.allowChecklistEdit ||
        adminPermissions.permissions?.ADMINISTER?.havePermission;
      const isAdminPermission =
        adminPermissions?.permissions?.ADMINISTER?.havePermission;
      setSiteAdmin(isAdminPermission);

      setMe({
        name: userData?.data?.displayName || "Unknown User",
        email: userData?.data?.emailAddress || "No Email Provided",
        avatar: userData?.data?.avatarUrls?.["48x48"] || "default-avatar-url",
      });
      setTasks(storedTasks || []);

      const usedTemplateNames = storedTasks
      .filter((task) => task.templateName && task.templateName !== "Custom")
      .map((task) => task.templateName);
    
    setTemplates({
      all: allTemplates || [],
      used: usedTemplateNames.length > 0 ? Array.from(new Set(usedTemplateNames)) : [],
    });
    

      setSettings(allSettings);
    

      navigate(isAllowed ? "/" : "/no-permission");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "An error occurred while fetching data.");
      navigate("/no-permission");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-darkBg">
        <Spinner size={"large"} label="Loading" />
      </div>
    );
  }

  return (
    <div className="w-full m-0 h-max dark:bg-darkBg">
      <Routes>
        <Route path="/" element={<CheckList />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/view" element={<View />} />
        <Route
          path="/no-permission"
          element={
            <WarningMessage
              title="Checklist Access Restricted"
              message="Only the Assignee and Reporter have the authority to view, edit, or delete this checklist."
            />
          }
        />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default App;
