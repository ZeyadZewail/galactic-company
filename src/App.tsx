import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { UseTicker } from "./hooks/useTicker.tsx";
import { Toaster } from "react-hot-toast";
import { Title } from "./components/Title.tsx";

import "reactflow/dist/style.css";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  EdgeChange,
  NodeChange,
  Panel,
  ReactFlow,
} from "reactflow";
import { nodeTypes, useNodeStore } from "./stores/useNodeStore.ts";
import { CreateNodeButton } from "./features/nodeInfra/CreateNodeButton.tsx";

export const App = () => {
  const [init, setInit] = useState(false);
  const { nodes, edges, setNodes, setEdges } = useNodeStore();

  useEffect(() => {
    setInit(true);
  }, []);

  UseTicker({ init });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges(addEdge(connection, edges));
    },
    [edges, setEdges],
  );

  if (!init) {
    return;
  }
  return (
    <div className="w-screen h-screen flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Panel position={"top-center"}>
          <Title />
        </Panel>

        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position={"top-left"} className={"w-[25%]"}>
          <div className="flex flex-col">
            <CreateNodeButton
              node={{
                id: "1",
                position: { x: 10, y: 10 },
                type: "BaseNode",
                data: {
                  name: "WoodCutter",
                  resourceType: "wood",
                  value: 0,
                  rate: 10,
                  built: false,
                  cost: 10,
                  handles: [{ handlePosition: "right", type: "source" }],
                },
              }}
            />
            <CreateNodeButton
              node={{
                id: "1",
                position: { x: 10, y: 10 },
                type: "BaseNode",
                data: {
                  name: "PlankMaker",
                  resourceType: "wood",
                  value: 0,
                  rate: 0,
                  built: false,
                  cost: 10,
                  handles: [
                    { handlePosition: "right", type: "source" },
                    {
                      handlePosition: "left",
                      type: "target",
                    },
                  ],
                },
              }}
            />
            <CreateNodeButton
              node={{
                id: "1",
                position: { x: 10, y: 10 },
                type: "BaseNode",
                data: {
                  name: "Storage",
                  resourceType: "plank",
                  value: 0,
                  rate: 0,
                  built: false,
                  cost: 10,
                  handles: [{ handlePosition: "left", type: "target" }],
                },
              }}
            />
          </div>
        </Panel>
        <Controls />
      </ReactFlow>
      <Toaster position="bottom-center" />
    </div>
  );
};
