// src/store/useStore.js

import { create } from "zustand";

const useStore = create((set) => ({
  tasks: [],
  templates: { all: [], used: [] },
  issueKey: "",
  me: {},
  emails: {},
  setEmails: (newEmails) => set({ emails: newEmails }),
  settings: {},
  siteAdmin: false,
  setMe: (newOwner) => set({ me: newOwner }),
  setSettings: (newSettings) => set({ settings: newSettings }),
  setSiteAdmin: (status) => set({ siteAdmin: status }), // Fixed to update siteAdmin
  setIssueKey: (key) => set(() => ({ issueKey: key })),
  setTasks: (newTasks) => set(() => ({ tasks: newTasks })),
  setTemplates: (newTemplates) => set(() => ({ templates: newTemplates })),
  updateTemplateSection: (section, items) =>
    set((state) => ({
      templates: {
        ...state.templates,
        [section]: items,
      },
    })),
}));

export default useStore;
