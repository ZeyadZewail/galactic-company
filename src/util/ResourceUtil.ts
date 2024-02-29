import { Edge, Node } from "reactflow";
import { ResourceNode } from "../stores/NodeStore.ts";

export const ReturnNodes = (data: Node<ResourceNode>[]) => {
  return Object.values(data).filter((n) => !!n && !!n.data);
};

export const ReturnEdges = (data: Edge[]) => {
  return Object.values(data).filter((e) => !!e);
};

export const FormatWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
