import { Resource, useResourceStore } from "../stores/ResourceStore.ts";
import { FormatWithCommas } from "../util/ResourceUtil.ts";

export const ResourceUIRow = ({ resource }: { resource: Resource }) => {
  const { increaseResource, addMachine } = useResourceStore();

  return (
    <div className="flex gap-2 w-full justify-between">
      <div className="flex gap-2 w-full justify-between">
        <div> {resource.name}</div>
        <div>{FormatWithCommas(resource.value)}</div>
        <div> {FormatWithCommas(resource.totalRate)}/s</div>
      </div>
      <button onClick={() => increaseResource(resource.name, 1)}>+1</button>
      <button
        onClick={() =>
          addMachine(resource.name, { name: "dummy 10/s", rate: 10 })
        }
      >
        +10/s
      </button>
    </div>
  );
};
