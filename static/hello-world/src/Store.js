// src/store/useStore.js

import { create } from "zustand";

const useStore = create((set) => ({
  tasks: [],
  templates: { all: [], used: [] },
  issueKey: "",
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
