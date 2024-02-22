import "./App.css";
import { useResourceStore } from "./stores/ResourceStore.ts";
import { useEffect, useState } from "react";
import { ResourceUIRow } from "./components/ResourceUIRow.tsx";
import { UseTicker } from "./hooks/useTicker.tsx";
import { ReturnResources } from "./util/ResourceUtil.ts";

export const App = () => {
  const { initResourceStore, data } = useResourceStore();
  const [init, setInit] = useState(false);
  const resources = ReturnResources(data);

  useEffect(() => {
    initResourceStore();
    setInit(true);
  }, []);

  UseTicker({ init });

  if (!init) {
    return;
  }

  return (
    <div className="flex flex-col">
      {resources.map((r) => (
        <ResourceUIRow resource={r} key={r.name} />
      ))}
    </div>
  );
};
