import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";
import { ResourceType } from "./ResourceStore.ts";

interface UIStore {
  currentResource: ResourceType | "";
  setCurrentResource: (resourceName: ResourceType) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        currentResource: "",
        setCurrentResource: (resourceName) =>
          set(() => ({ currentResource: resourceName })),
      }),
      {
        name: "UI-storage",
      },
    ),
  ),
);
