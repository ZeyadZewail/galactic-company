import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";
import { Edge, Node } from "reactflow";
import { ResourceType } from "./ResourceStore.ts";
import { BaseNode } from "../features/nodeInfra/BaseNode.tsx";

export const nodeTypes = { BaseNode: BaseNode };

export type nodeLogicalType = "generator" | "producer" | "storage";

type handlePosition = "right" | "left" | "top" | "bottom";

interface handle {
  handlePosition: handlePosition;
  type: "source" | "target";
}

export interface ResourceNode {
  name: string;
  nodeLogicalType: nodeLogicalType;
  storageType: ResourceType | null;
  storage: number;
  outputType: ResourceType | null;
  outputBuffer: number;
  outputRate: number;
  built: boolean;
  cost: number;
  handles: handle[];
}

interface NodeStore {
  lastID: number;
  nodes: Node<ResourceNode>[];
  nodeDict: Record<string, Node<ResourceNode>>;
  setNodes: (nodes: Node<ResourceNode>[]) => void;
  addNode: (node: Node<ResourceNode>) => void;
  deleteNodeByID: (id: string) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
}

const initNode: Node<ResourceNode> = {
  id: "0",
  position: { x: 600, y: 400 },
  type: "BaseNode",
  data: {
    name: "WoodCutter",
    nodeLogicalType: "generator",
    storageType: null,
    storage: 0,
    outputType: "wood",
    outputBuffer: 0,
    outputRate: 10,
    built: true,
    cost: 10,
    handles: [{ handlePosition: "right", type: "source" }],
  },
};

export const useNodeStore = create<NodeStore>()(
  devtools(
    persist(
      (set) => ({
        nodes: [initNode],
        nodeDict: { "0": initNode },
        edges: [],
        lastID: 0,
        addNode: (node) =>
          set((state) => {
            const newID = (state.lastID + 1).toString();
            const tempNewDict = { ...state.nodeDict };
            tempNewDict[newID] = node;

            return {
              nodes: [...state.nodes, { ...node, id: newID }],
              lastID: state.lastID + 1,
              nodeDict: tempNewDict,
            };
          }),
        setNodes: (nodes) => set(() => ({ nodes: nodes })),
        deleteNodeByID: (id) =>
          set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== id),
            edges: state.edges.filter(
              (e) => e.source !== id && e.target !== id,
            ),
          })),
        setEdges: (edges) => set(() => ({ edges: edges })),
      }),
      {
        name: "node-storage",
      },
    ),
  ),
);
