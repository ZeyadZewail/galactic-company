import { useMetaStore as MetaStore } from "../stores/MetaStore.ts";
import { ReturnNodes } from "./ResourceUtil.ts";

import { Node } from "reactflow";
import {
  ResourceNode,
  useNodeStore as NodeStore,
} from "../stores/NodeStore.ts";

export const CreateInterval = () =>
  setInterval(() => {
    Tick();
  }, 1000);

export const Tick = (count?: number) => {
  const { nodesDict } = NodeStore.getState();
  const { setLastTickDate } = MetaStore.getState();

  setLastTickDate(new Date());
  if (count && count > -1) {
    tickAllNodes(nodesDict);
  } else {
    tickAllNodes(nodesDict);
  }
};

const tickAllNodes = (nodes: Record<string, Node<ResourceNode>>) => {
  const { setNodes } = NodeStore.getState();

  const processedNodes = ReturnNodes(nodes);

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
  for (let i = 0; i < processedNodes.length; i++) {
    const source = processedNodes[i];
    const sourceTargetIds = source.data.targetIds;
    const target = nodes[sourceTargetIds[source.data.lastTargetedIndex]];
    if (!target) {
      continue;
    }

    // debug
    // console.log("source", source);
    // console.log("lastTargetedIndex", source.data.lastTargetedIndex);
    // console.log("target", target);

    source.data.lastTargetedIndex =
      source.data.lastTargetedIndex + 1 > sourceTargetIds.length - 1
        ? 0
        : source.data.lastTargetedIndex + 1;

    if (source?.data && target?.data) {
      target.data.storage += source.data.outputBuffer;
      source.data.outputBuffer = 0;
    }
  }

  setNodes(processedNodes);
};
