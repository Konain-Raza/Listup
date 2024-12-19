import { create } from "zustand";

const useStore = create((set) => ({
  templates: [],
  me: {},
  settings: {},
  siteAdmin: false, // Correct key for admin status
  setSettings: (newSettings) => set({ settings: newSettings }),
  setSiteAdmin: (status) => set({ siteAdmin: status }), // Fixed to update siteAdmin
  setMe: (newOwner) => set({ me: newOwner }),
  setTemplates: (templates) => set({ templates }),
 
}));

export default useStore;
