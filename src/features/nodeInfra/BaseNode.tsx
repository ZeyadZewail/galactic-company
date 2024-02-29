import { Handle, Position } from "reactflow";
import { ResourceNode, useNodeStore } from "../../stores/useNodeStore.ts";
import { ReactNode, useMemo } from "react";

export const BaseNode = ({ id, data }: { id: string; data: ResourceNode }) => {
  const { deleteNodeByID } = useNodeStore();

  const handles = useMemo(() => {
    const tempHandles: ReactNode[] = [];

    if (!data.handles) {
      return [];
    }

    for (let i = 0; i < data.handles.length; i++) {
      const handle = data.handles[i];

      tempHandles.push(
        <Handle
          type={handle.type}
          position={handle.handlePosition as Position}
          id={id + handle.handlePosition}
          key={handle.handlePosition}
        />,
      );
    }

    return tempHandles;
  }, [data.handles, id]);

  return (
    <>
      <div className="w-60 bg-white flex justify-between items-center p-4">
        <div className="text-black flex-col flex">
          <div>{data.name}</div>
          <div>{data.resourceType}</div>
          <div>value: {data.value}</div>
          <div>rate: {data.rate}/s</div>
        </div>

        <button className="p-2 bg-red-400" onClick={() => deleteNodeByID(id)}>
          delete
        </button>
      </div>
      {handles}
    </>
  );
};
