import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";

export interface Resource {
  name: ResourceType;
  machines: Machine[];
  value: number;
  totalRate: number;
}

interface Machine {
  name: string;
  rate: number;
}

export const ResourceTypes = ["wood", "stone", "iron"] as const;
export type ResourceType = (typeof ResourceTypes)[number];

interface Resources {
  data: Record<string, Resource>;
  initResourceStore: () => void;
  increaseResource: (resourceName: ResourceType, count: number) => void;
  addMachine: (resourceName: ResourceType, machine: Machine) => void;
  setState: (res: Record<string, Resource>) => void;
  getResource: (resourceName: ResourceType) => Resource | null;
}

export const useResourceStore = create<Resources>()(
  devtools(
    persist(
      (set, get) => ({
        data: {},
        initResourceStore: () => {
          set((oldState) => {
            const data = { ...oldState.data };
            for (const key of ResourceTypes) {
              if (!data[key]) {
                data[key] = {
                  name: key,
                  machines: [],
                  value: 0,
                  totalRate: 0,
                };
              }
            }
            return { data };
          });
        },
        increaseResource: (resourceName, count) => {
          set((oldState) => {
            const data = { ...oldState.data };
            data[resourceName].value += count;
            return { data };
          });
        },
        addMachine: (resourceName, machine) => {
          set((oldState) => {
            const data = { ...oldState.data };
            data[resourceName].machines.push(machine);
            data[resourceName].totalRate = data[resourceName].machines.reduce(
              (acc, machine) => acc + machine.rate,
              0,
            );
            return { data };
          });
        },
        setState: (res) => {
          set((oldState) => {
            const data = { ...oldState.data };
            for (const key in Object.keys(res)) {
              data[key] = res[key];
            }
            return { data };
          });
        },
        getResource: (resourceName) => {
          const resource = get().data[resourceName];
          if (resource) {
            return resource;
          } else {
            return null;
          }
        },
      }),
      {
        name: "resource-storage",
      },
    ),
  ),
);
