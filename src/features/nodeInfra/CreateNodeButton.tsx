import { ResourceNode, useNodeStore } from "../../stores/NodeStore.ts";
import { Node, useReactFlow } from "reactflow";

export const CreateNodeButton = ({ node }: { node: Node<ResourceNode> }) => {
  const { addNode } = useNodeStore();
  const reactFlowInstance = useReactFlow();
  return (
    <button
      onClick={() => addNode(node, reactFlowInstance)}
    >{`Add ${node.data.name}`}</button>
  );
};
