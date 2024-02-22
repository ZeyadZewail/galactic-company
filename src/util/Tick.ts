import {
  Resource,
  useResourceStore as ResourceStore,
} from "../stores/ResourceStore.ts";
import { useMetaStore as MetaStore } from "../stores/MetaStore.ts";
import { ReturnResources } from "./ResourceUtil.ts";

export const CreateInterval = () =>
  setInterval(() => {
    Tick();
  }, 1000);

export const Tick = (count?: number) => {
  const { data } = ResourceStore.getState();
  const { setLastTickDate } = MetaStore.getState();

  setLastTickDate(new Date());
  if (count && count > -1) {
    tickAllResources(data, count);
  } else {
    tickAllResources(data, 1);
  }
};

const tickAllResources = (data: Record<string, Resource>, count: number) => {
  const { setState } = ResourceStore.getState();
  const tempData = { ...data };
  const resources = ReturnResources(tempData);

  for (let i = 0; i < resources.length; i++) {
    if (resources[i].totalRate) {
      resources[i].value += resources[i].totalRate * count;
    }
  }

  setState(tempData);
};
