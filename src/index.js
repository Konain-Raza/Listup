import Resolver from "@forge/resolver";
import api, { storage, route } from "@forge/api";

const resolver = new Resolver();

// Fetch tasks for the issue
resolver.define("getTasks", async (req) => {
  const { issueKey } = req.payload;
  try {
    const tasks = await storage.get(`${issueKey}_tasks`);
    console.log(`Fetched tasks for issue ${issueKey}:`, tasks);
    return tasks || [];
  } catch (error) {
    console.error("Error fetching tasks for issue:", issueKey, error);
    throw new Error("Failed to retrieve tasks.");
  }
});

resolver.define("getTicketDetails", async (req) => {
  const { ticketId } = req.payload; // Extract the ticket ID from the request payload

  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/issue/${ticketId}`, {
        headers: {
          Accept: "application/json",
        },
      });

    if (!response.ok) {
      console.error(`Failed to fetch ticket details: ${response.statusText}`);
      throw new Error("Failed to retrieve ticket details.");
    }

    const ticketDetails = await response.json(); // Parse the response JSON
    console.log(`Fetched details for ticket ${ticketId}:`, ticketDetails);

    return ticketDetails; // Return the resolved details
  } catch (error) {
    console.error("Error resolving ticket details:", ticketId, error);
    throw new Error("Error occurred while fetching ticket details.");
  }
});

resolver.define("updateTicketDetails", async (req) => {
  const { body, issueKey } = req.payload; // Extract the request body
  console.log("Request Body:", body);
  console.log("Issue Key:", issueKey);

  if (!issueKey) {
    throw new Error("Issue Key is missing in the request body");
  }

  try {
    // const response = await api.asUser().requestJira(route`/rest/api/2/issue/{issueIdOrKey}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: bodyData
    // });
    
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/2/issue/${issueKey}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body), // Ensure you're sending the correct ticket data
      });

    if (!response.ok) {
      const responseText = await response.text(); // Read the body as text (or use .json() if you expect JSON)
      console.error(
        `Failed to update ticket details: ${response.status} ${response.statusText}`
      );
      console.error("Response body:", responseText);
      throw new Error("Failed to update ticket details.");
    }

    console.log("Ticket updated successfully.");
    return await response.json(); // If successful, return the updated ticket details
  } catch (error) {
    console.error("Error updating ticket details for", issueKey, error);
    throw new Error("Error occurred while updating ticket details.");
  }
});

// Fetch templates based on current route
resolver.define("getTemplates", async (req) => {
  try {
    const currentRoute = req.payload?.currentRoute || "";
    console.log("Current Route:", currentRoute);

    const match = currentRoute.match(/^https?:\/\/([a-zA-Z0-9.-]+)\.atlassian/);
    let subdomain = match ? match[1] : null;

    if (!subdomain) {
      if (currentRoute.includes("localhost")) {
        console.log("Running on localhost, no subdomain expected.");
        subdomain = "localhost"; // Default to "localhost" when testing locally
      } else {
        console.error(
          "Invalid or missing subdomain in the route:",
          currentRoute
        );
        throw new Error("Subdomain is required and must be a valid string.");
      }
    }

    console.log("Subdomain:", subdomain);

    const sanitizedSubdomain = subdomain
      .trim()
      .replace(/[^a-zA-Z0-9:._\s-#]/g, "#");
    const key = `${sanitizedSubdomain}_templates`;

    const templates = await storage.get(key);
    if (!templates) {
      console.log(`No templates found for subdomain: ${sanitizedSubdomain}`);
    }

    return templates || [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to retrieve templates from storage.");
  }
});

// Save tasks for the issue
resolver.define("setTasks", async (req) => {
  const { issueKey, tasks } = req.payload;
  try {
    console.log(`Saving tasks for issue ${issueKey}:`, tasks);
    await storage.set(`${issueKey}_tasks`, tasks);
    return { success: true };
  } catch (error) {
    console.error("Error saving tasks for issue:", issueKey, error);
    throw new Error("Failed to save tasks.");
  }
});

// Save templates for the subdomain
resolver.define("setTemplates", async (req) => {
  try {
    const currentRoute = req.payload?.currentRoute || "";
    console.log("Current Route:", currentRoute);

    const match = currentRoute.match(/^https?:\/\/([a-zA-Z0-9.-]+)\.atlassian/);
    let subdomain = match ? match[1] : null;

    if (!subdomain) {
      // Check for localhost or other cases
      if (currentRoute.includes("localhost")) {
        console.log("Running on localhost, no subdomain expected.");
      } else {
        throw new Error(
          "Subdomain could not be extracted from the current route."
        );
      }
    }

    console.log("Subdomain:", subdomain);

    const { templates } = req.payload;
    console.log("Payload Templates:", templates);

    if (!Array.isArray(templates)) {
      throw new Error("Templates must be an array.");
    }

    const sanitizedSubdomain = subdomain
      ? subdomain.trim().replace(/[^a-zA-Z0-9:._\s-#]/g, "#")
      : "localhost";
    const key = `${sanitizedSubdomain}_templates`;

    await storage.set(key, templates);

    return { success: true };
  } catch (error) {
    console.error("Error saving templates:", error);
    throw new Error("Failed to save templates.");
  }
});

// Fetch user data
resolver.define("getMyself", async () => {
  try {
    const response = await api.asUser().requestJira(route`/rest/api/3/myself`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch user data:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch user data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched user data:", data);
    return { data };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data.");
  }
});

export const handler = resolver.getDefinitions();
