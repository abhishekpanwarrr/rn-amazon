// export const storage = new MMKV({
//   id: "mmkv-storage",
// });
import { StateStorage } from "zustand/middleware";

export const zustandStorage: StateStorage = {
  getItem: async (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: async (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    localStorage.removeItem(name);
  },
};
