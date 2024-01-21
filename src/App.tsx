import "./App.css";
import { useBearStore } from "./stores/Test.ts";

import WorkerFactory from "./Util/WebWorker/WorkerFactory.tsx";
import myWorker from "./Util/WebWorker/myWorker.worker.ts";
import { Tick } from "./Util/Tick.ts";

const workerInstance = new WorkerFactory(myWorker) as Worker;
workerInstance.postMessage("Start");
workerInstance.onmessage = () => {
  Tick();
};

export const App = () => {
  const { bears } = useBearStore();

  return <div>{bears}</div>;
};
