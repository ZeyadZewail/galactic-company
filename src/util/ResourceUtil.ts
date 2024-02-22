import { Resource } from "../stores/ResourceStore.ts";

export const ReturnResources = (data: Record<string, Resource>) => {
  return Object.values(data).filter((r) => !!r);
};
