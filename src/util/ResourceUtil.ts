import { Resource } from "../stores/ResourceStore.ts";

export const ReturnResources = (data: Record<string, Resource>) => {
  return Object.values(data).filter((r) => !!r);
};

export const FormatWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
