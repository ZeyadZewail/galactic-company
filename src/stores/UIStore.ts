import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";

interface UIStore {}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(() => ({}), {
      name: "UI-storage",
    }),
  ),
);
