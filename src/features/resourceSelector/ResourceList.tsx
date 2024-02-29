import { useResourceStore } from "../../stores/ResourceStore.ts";
import { ReturnResources } from "../../util/ResourceUtil.ts";
import { ResourceUIRow } from "./ResourceUIRow.tsx";

export const ResourceList = () => {
  const { data } = useResourceStore();
  const resources = ReturnResources(data);

  return (
    <div>
      {resources.map((r) => (
        <ResourceUIRow resource={r} key={r.name} />
      ))}
    </div>
  );
};
