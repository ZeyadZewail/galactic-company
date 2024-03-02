import "./App.css";
import { useCallback, useMemo, useRef, useState } from "react";
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
  Edge,
  EdgeChange,
  NodeChange,
  Panel,
  ReactFlow,
  updateEdge,
} from "reactflow";
import { nodeTypes, useNodeStore } from "./stores/NodeStore.ts";
import { CreateNodeButton } from "./features/nodeInfra/CreateNodeButton.tsx";
import { Tick } from "./util/Tick.ts";
import { latestVer, useMetaStore } from "./stores/MetaStore.ts";
import { BaseConnectionLine } from "./features/nodeInfra/BaseConnectionLine.tsx";
import { UseTicker } from "./hooks/useTicker.tsx";

export const App = () => {
  const [init, setInit] = useState(false);
  const edgeUpdateSuccessful = useRef(true);
  const { nodesDict, edges, setNodes, setEdges, deleteEdge, reset } =
    useNodeStore();
  const { ver } = useMetaStore();

  // debug
  // console.log("nodesDict", nodesDict);
  // console.log("edges", edges);

  //force reset store in case of breaking change
  if (!ver || ver !== latestVer) {
    console.log("reset store");
    localStorage.clear();
    location.reload();
  }

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

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      if (newConnection.source && newConnection.target) {
        nodesDict[newConnection.source].data.targetIds = nodesDict[
          newConnection.source
        ].data.targetIds.filter((t) => t !== oldEdge.target);
        nodesDict[newConnection.source].data.targetIds.push(
          newConnection.target,
        );
      }
      setEdges(updateEdge(oldEdge, newConnection, edges));
    },
    [edges, nodesDict, setEdges],
  );

  const onEdgeUpdateEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        deleteEdge(edge);
      }

      edgeUpdateSuccessful.current = true;
    },
    [deleteEdge],
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
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onConnect={onConnect}
        connectionLineComponent={BaseConnectionLine}
        onInit={() => setInit(true)}
      >
        <Panel position={"top-center"}>
          <Title />
        </Panel>
        <Background
          style={{ backgroundColor: "#242424" }}
          color={"#ffffffde"}
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
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
                  targetIds: [],
                  lastTargetedIndex: 0,
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
                  targetIds: [],
                  lastTargetedIndex: 0,
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
                  targetIds: [],
                  lastTargetedIndex: 0,
                },
              }}
            />
            <button onClick={() => Tick()}>Tick</button>
            <button
              onClick={() => {
                reset();
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
