import { Handle, Position } from "reactflow";
import { CSSProperties } from "react";
import { CustomHandle, useNodeStore } from "../../stores/NodeStore.ts";

export const BaseHandle = ({
  id,
  handleData,
  style,
}: {
  id: string;
  handleData: CustomHandle;
  style: CSSProperties;
}) => {
  const { nodesDict } = useNodeStore();

  return (
    <Handle
      id={id}
      type={handleData.type}
      position={handleData.handlePosition as Position}
      onConnect={(params) => {
        if (params.source && params.target) {
          nodesDict[params.source].data.targetIds.push(params.target);
        }
      }}
      style={style}
    />
  );
};
