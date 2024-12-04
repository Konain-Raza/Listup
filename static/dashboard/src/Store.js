import { create } from "zustand";

const useStore = create((set) => ({
  templates: [],
  me: {},
  setMe: (newOwner) => set({ me: newOwner }),
  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) =>
    set((state) => ({ templates: [...state.templates, template] })),
  removeTemplate: (templateId) =>
    set((state) => ({
      templates: state.templates.filter(
        (template) => template.id !== templateId
      ),
    })),
}));

export default useStore;
