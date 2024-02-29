import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";
import { Edge, Node } from "reactflow";
import { ResourceType } from "./ResourceStore.ts";
import { BaseNode } from "../features/nodeInfra/BaseNode.tsx";

export const nodeTypes = { BaseNode: BaseNode };

type handlePosition = "right" | "left" | "top" | "bottom";

interface handle {
  handlePosition: handlePosition;
  type: "source" | "target";
}

export interface ResourceNode {
  resourceType: ResourceType;
  name: string;
  value: number;
  rate: number;
  built: boolean;
  cost: number;
  handles: handle[];
}

interface NodeStore {
  lastID: number;
  nodes: Node<ResourceNode>[];
  setNodes: (nodes: Node<ResourceNode>[]) => void;
  addNode: (node: Node<ResourceNode>) => void;
  deleteNodeByID: (id: string) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
}

export const useNodeStore = create<NodeStore>()(
  devtools(
    persist(
      (set) => ({
        nodes: [
          {
            id: "1",
            position: { x: 600, y: 400 },
            type: "BaseNode",
            data: {
              name: "WoodCutter",
              resourceType: "wood",
              value: 0,
              rate: 10,
              built: true,
              cost: 10,
              handles: [{ handlePosition: "right", type: "source" }],
            },
          },
        ],
        edges: [],
        lastID: 0,
        addNode: (node) =>
          set((state) => ({
            nodes: [
              ...state.nodes,
              { ...node, id: (state.lastID + 1).toString() },
            ],
            lastID: state.lastID + 1,
          })),
        setNodes: (nodes) => set(() => ({ nodes: nodes })),
        deleteNodeByID: (id) =>
          set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
        setEdges: (edges) => set(() => ({ edges: edges })),
      }),
      {
        name: "node-storage",
      },
    ),
  ),
);
