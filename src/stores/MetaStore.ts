import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";
import { CreateInterval } from "../util/Tick.ts";

interface MetaState {
  lastTickDate: Date;
  setLastTickDate: (d: Date) => void;
  Ticker: number | null;
  ver: string;
  setVer: (newVer: string) => void;
  startTicker: () => void;
  clearTicker: () => void;
}

export const latestVer = "0.1";

export const useMetaStore = create<MetaState>()(
  devtools(
    persist(
      (set, get) => ({
        lastTickDate: new Date(),
        setLastTickDate: (d) => set(() => ({ lastTickDate: d })),
        Ticker: null,
        ver: latestVer,
        setVer: (newVer) => set({ ver: newVer }),
        startTicker: () => {
          // Ensure there's no running interval
          if (get().Ticker === null) {
            const id = CreateInterval(); // Set the interval to 1 second
            // Store the interval ID in the store
            set({ Ticker: id });
          }
        },
        clearTicker: () => {
          const ticker = get().Ticker;
          if (ticker !== null) {
            clearInterval(ticker);
            set({ Ticker: null });
          }
        },
      }),
      {
        name: "meta-storage",
      },
    ),
  ),
);
