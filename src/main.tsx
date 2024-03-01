import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { latestVer, useMetaStore as MetaStore } from "./stores/MetaStore.ts";

//force reset store in case of breaking change
const { ver } = MetaStore.getState();

if (!ver || ver !== latestVer) {
  console.log("reset store");
  localStorage.clear();
  location.reload();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
