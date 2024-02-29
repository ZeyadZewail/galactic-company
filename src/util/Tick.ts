import { useMetaStore as MetaStore } from "../stores/MetaStore.ts";
import { ReturnEdges, ReturnNodes } from "./ResourceUtil.ts";

import { Edge, Node } from "reactflow";
import {
  ResourceNode,
  useNodeStore as NodeStore,
} from "../stores/NodeStore.ts";

export const CreateInterval = () =>
  setInterval(() => {
    Tick();
  }, 1000);

export const Tick = (count?: number) => {
  const { nodes, edges } = NodeStore.getState();
  const { setLastTickDate } = MetaStore.getState();

  setLastTickDate(new Date());
  if (count && count > -1) {
    tickAllNodes(nodes, edges);
  } else {
    tickAllNodes(nodes, edges);
  }
};

const tickAllNodes = (nodes: Node<ResourceNode>[], edges: Edge[]) => {
  const { setNodes, nodeDict } = NodeStore.getState();

  const processedNodes = ReturnNodes(nodes);

  const processedEdges = ReturnEdges(edges);

  // first pass (generation)
  for (let i = 0; i < processedNodes.length; i++) {
    const node = processedNodes[i];

    if (node && node.data) {
      // generator logic
      if (node.data.nodeLogicalType === "generator") {
        node.data.outputBuffer += node.data.outputRate;
      }

      // producer logic
      if (node.data.nodeLogicalType === "producer") {
        if (node.data.storage > node.data.outputRate) {
          node.data.storage -= node.data.outputRate;
          node.data.outputBuffer += node.data.outputRate;
        }
      }
    }
  }

  // second pass (transportation)
  for (let i = 0; i < processedEdges.length; i++) {
    const edge = processedEdges[i];
    const target = nodeDict[edge.target];
    const source = nodeDict[edge.source];

    target.data.storage += source.data.outputBuffer;
    source.data.outputBuffer = 0;
  }

  setNodes(processedNodes);
};
