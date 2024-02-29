import { ResourceNode, useNodeStore } from "../../stores/NodeStore.ts";
import { Node } from "reactflow";

export const CreateNodeButton = ({ node }: { node: Node<ResourceNode> }) => {
  const { addNode } = useNodeStore();

  return (
    <button onClick={() => addNode(node)}>{`Add ${node.data.name}`}</button>
  );
};
