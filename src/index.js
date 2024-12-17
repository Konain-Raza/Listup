import Resolver from "@forge/resolver";
import api, { storage, route } from "@forge/api";

const resolver = new Resolver();

const getKey = () => "advancedChecklist";

resolver.define("getTasks", async (req) => {
  const { issueKey } = req.payload;
  console.log(issueKey);

  try {
    const tasks = await storage.get(`${issueKey}_tasks`);
    console.log(tasks);
    return tasks || [];
  } catch {
    throw new Error("Failed to retrieve tasks.");
  }
});

resolver.define("getTicketDetails", async (req) => {
  const { ticketId } = req.payload;

  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/issue/${ticketId}`, {
        headers: { Accept: "application/json" },
      });

    if (!response.ok) throw new Error("Failed to retrieve ticket details.");
    return await response.json();
  } catch {
    throw new Error("Error occurred while fetching ticket details.");
  }
});

resolver.define("updateTicketDetails", async (req) => {
  const { body, issueKey } = req.payload;
  if (!issueKey) throw new Error("Issue Key is missing.");

  const sanitizedKey = getKey();
  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/2/issue/${issueKey}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

    if (!response.ok) throw new Error("Failed to update ticket details.");
    return await response.json();
  } catch {
    throw new Error("Error occurred while updating ticket details.");
  }
});

resolver.define("getTemplates", async (req) => {
  const sanitizedKey = getKey();
  try {
    const templates = await storage.get(`${sanitizedKey}_templates`);
    return templates || [];
  } catch {
    throw new Error("Failed to retrieve templates.");
  }
});

resolver.define("setTasks", async (req) => {
  const { issueKey, tasks } = req.payload;
  console.log(issueKey);
  console.log(tasks);
  try {
    await storage.set(`${issueKey}_tasks`, tasks);
    return { success: true };
  } catch {
    throw new Error("Failed to save tasks.");
  }
});

resolver.define("setTemplates", async (req) => {
  const { templates } = req.payload;
  const sanitizedKey = getKey();
  try {
    await storage.set(`${sanitizedKey}_templates`, templates);
    return { success: true };
  } catch {
    throw new Error("Failed to save templates.");
  }
});

resolver.define("getSettings", async (req) => {
  const sanitizedKey = getKey();
  try {
    const settings = await storage.get(`${sanitizedKey}_settings`);
    return (
      settings || {
        allowTemplateEdit: false,
        allowChecklistEdit: false,
      }
    );
  } catch {
    throw new Error("Failed to retrieve settings.");
  }
});

resolver.define("setSettings", async (req) => {
  const { newSettings } = req.payload;
  const sanitizedKey = getKey();
  try {
    await storage.set(`${sanitizedKey}_settings`, newSettings);
    return { success: true };
  } catch {
    throw new Error("Failed to save settings.");
  }
});

resolver.define("getMyself", async () => {
  try {
    const response = await api.asUser().requestJira(route`/rest/api/3/myself`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch user data.");
    return { data: await response.json() };
  } catch {
    throw new Error("Failed to fetch user data.");
  }
});

resolver.define("checkAdminPermissions", async () => {
  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/mypermissions?permissions=ADMINISTER`, {
        headers: { Accept: "application/json" },
      });

    if (!response.ok) throw new Error("Failed to check admin permissions.");
    return await response.json();
  } catch {
    throw new Error("Failed to check admin permissions.");
  }
});

export const handler = resolver.getDefinitions();
