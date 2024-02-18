import "./App.css";
import { UseTicker } from "./hooks/useTicker.tsx";
import { useBearStore } from "./stores/Test.ts";

export const App = () => {
  UseTicker();
  const { bears } = useBearStore();

  return <div>{bears}</div>;
};
