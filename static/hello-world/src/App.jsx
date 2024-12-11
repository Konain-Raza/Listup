import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckList from "./pages/Checklist";
import Templates from "./pages/Templates";
import View from "./pages/View";
import useStore from "./Store";
import { view, invoke } from "@forge/bridge";
import SectionMessage from '@atlaskit/section-message';
import "./index.css";
import Spinner from '@atlaskit/spinner';

const App = () => {
  const navigate = useNavigate();
  const {
    setIssueKey,
    setSettings,
    setTasks,
    setTemplates,
    setSiteAdmin,
    settings,
    setMe,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [appSettings, setAppSettings] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    let isAllowed; 

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
        allPermissions,
        allSettings,
      ] = await Promise.all([
        invoke("getTicketDetails", { ticketId: currentIssueKey }),
        invoke("getTasks", { issueKey: currentIssueKey }),
        invoke("getMyself"),
        invoke("getTemplates"),
        invoke("checkAdminPermissions"),
        invoke("getSettings"),
      ]);

      const emails = [
        ticketDetails.fields.assignee.emailAddress,
        ticketDetails.fields.creator.emailAddress,
        ticketDetails.fields.reporter.emailAddress,
      ];
      setAllowedEmails(emails);
      setMe(userData);
      setSiteAdmin(allPermissions);

      const usedTemplateNames = new Set(
        storedTasks
          .filter((task) => task.templateName !== "Custom")
          .map((task) => task.templateName)
      );
      setTasks(storedTasks || []);
      setTemplates({
        all: allTemplates || [],
        used: Array.from(usedTemplateNames),
      });
      setSettings(allSettings);
      setAppSettings(allSettings);
      // console.log(userData.data.emailAddress);
      console.log(
        emails.includes(userData.data.emailAddress),
        allSettings.allowChecklistEdit,
        allPermissions.permissions?.ADMINISTER?.havePermission
      );
      isAllowed =
        emails.includes() ||
        allSettings.allowChecklistEdit || // Assuming this is the correct property name
        allPermissions.permissions?.ADMINISTER?.havePermission;
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching data.");
    } finally {
      navigate(isAllowed ? "/no-permission" : "/no-permission");

      setIsLoading(false);
      console.log(isAllowed)
      navigate(isAllowed ? "/no-permission" : "/no-permission");
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
    <div className="w-full m-0 p-3 h-max dark:bg-darkBg">
      <Routes>
        <Route path="/" element={<CheckList />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/view" element={<View />} />
        <Route
          path="/no-permission"
          element={
            <SectionMessage title="This account has been permanently deleted" appearance="error">
            <p>You're not allowed to change these restrictions. It's either due to the restrictions on the page, or permission settings for this space.</p>
          </SectionMessage>
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
