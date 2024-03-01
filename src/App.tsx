import "./App.css";
import { useCallback, useMemo, useState } from "react";
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
import { nodeTypes, useNodeStore } from "./stores/NodeStore.ts";
import { CreateNodeButton } from "./features/nodeInfra/CreateNodeButton.tsx";
import { Tick } from "./util/Tick.ts";
import { UseTicker } from "./hooks/useTicker.tsx";

export const App = () => {
  const [init, setInit] = useState(false);
  const { nodesDict, edges, setNodes, setEdges } = useNodeStore();

  const nodes = useMemo(() => Object.values(nodesDict), [nodesDict]);

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

  UseTicker({ init });

  return (
    <div className="w-screen h-screen flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={() => setInit(true)}
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
                  nodeLogicalType: "generator",
                  storageType: null,
                  storage: 0,
                  outputType: "wood",
                  outputBuffer: 0,
                  outputRate: 10,
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
                  nodeLogicalType: "producer",
                  storageType: "wood",
                  storage: 0,
                  outputType: "plank",
                  outputBuffer: 0,
                  outputRate: 5,
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
                  nodeLogicalType: "storage",
                  storageType: "plank",
                  storage: 0,
                  outputType: null,
                  outputBuffer: 0,
                  outputRate: 0,
                  built: false,
                  cost: 10,
                  handles: [{ handlePosition: "left", type: "target" }],
                },
              }}
            />
            <button onClick={() => Tick()}>Tick</button>
            <button
              onClick={() => {
                setNodes([]);
                setEdges([]);
              }}
            >
              reset
            </button>
          </div>
        </Panel>
        <Controls />
      </ReactFlow>
      <Toaster position="bottom-center" />
    </div>
  );
};
