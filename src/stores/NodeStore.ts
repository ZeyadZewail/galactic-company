import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // noinspection ES6UnusedImports
import {} from "@redux-devtools/extension";
import { Edge, Node, ReactFlowInstance } from "reactflow";

import { BaseNode } from "../features/nodeInfra/BaseNode.tsx";

export const nodeTypes = { BaseNode: BaseNode };

export type nodeLogicalType = "generator" | "producer" | "storage";

type handlePosition = "right" | "left" | "top" | "bottom";

export interface CustomHandle {
  handlePosition: handlePosition;
  type: "source" | "target";
}

export const ResourceTypes = ["wood", "stone", "iron", "plank"] as const;
export type ResourceType = (typeof ResourceTypes)[number];

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
  handles: CustomHandle[];
  targetIds: string[];
  lastTargetedIndex: number;
}

interface NodeStore {
  lastID: number;
  nodesDict: Record<string, Node<ResourceNode>>;
  setNodes: (nodes: Node<ResourceNode>[]) => void;
  addNode: (
    node: Node<ResourceNode>,
    reactFlowInstance: ReactFlowInstance,
  ) => void;
  deleteNodeByID: (id: string) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  deleteEdgeByID: (id: string, sourceId: string, targetId: string) => void;
  deleteEdge: (edge: Edge) => void;
  reset: () => void;
}

const initNode: Node<ResourceNode> = {
  id: "0",
  position: { x: 0, y: 0 },
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
    targetIds: [],
    lastTargetedIndex: 0,
  },
};

export const nodeStoreInitialState = {
  nodesDict: { "0": initNode },
  edges: [],
  lastID: 0,
};

export const useNodeStore = create<NodeStore>()(
  devtools(
    persist(
      (set) => ({
        ...nodeStoreInitialState,
        addNode: (node, reactFlowInstance) =>
          set((state) => {
            const newID = (state.lastID + 1).toString();
            const newNodes = { ...state.nodesDict };
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const centerPosition = reactFlowInstance.screenToFlowPosition({
              x: windowWidth / 2,
              y: windowHeight / 2,
            });
            newNodes[newID] = { ...node, id: newID, position: centerPosition };

            return {
              nodesDict: newNodes,
              lastID: state.lastID + 1,
            };
          }),
        setNodes: (nodes) =>
          set(() => {
            const tempNodes: Record<string, Node<ResourceNode>> = {};

            for (let i = 0; i < nodes.length; i++) {
              tempNodes[nodes[i].id] = nodes[i];
            }

            return { nodesDict: tempNodes };
          }),
        deleteNodeByID: (id) =>
          set((state) => {
            const filteredNodes: Record<string, Node<ResourceNode>> = {};

            Object.entries(state.nodesDict).forEach(([key, value]) => {
              if (value.id !== id) {
                filteredNodes[key] = value;
              }
            });

            return {
              nodesDict: filteredNodes,
              edges: state.edges.filter(
                (e) => e.source !== id && e.target !== id,
              ),
            };
          }),
        setEdges: (edges) => set(() => ({ edges: edges })),
        deleteEdgeByID: (edgeId, sourceId, targetId) =>
          set((state) => {
            const filteredEdges = state.edges.filter((e) => e.id !== edgeId);
            const newDict = { ...state.nodesDict };

            newDict[sourceId].data.targetIds = newDict[
              sourceId
            ].data.targetIds.filter((i) => i !== targetId);

            return {
              nodesDict: newDict,
              edges: filteredEdges,
            };
          }),
        deleteEdge: (edge) =>
          set((state) => {
            const filteredEdges = state.edges.filter((e) => e.id !== edge.id);
            const newDict = { ...state.nodesDict };

            newDict[edge.source].data.targetIds = newDict[
              edge.source
            ].data.targetIds.filter((i) => i !== edge.target);

            return {
              nodesDict: newDict,
              edges: filteredEdges,
            };
          }),
        reset: () => set({ nodesDict: {}, edges: [], lastID: 0 }),
      }),
      {
        name: "node-storage",
      },
    ),
  ),
);
