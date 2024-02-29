import { Resource } from "../../stores/ResourceStore.ts";
import { FormatWithCommas } from "../../util/ResourceUtil.ts";

export const ResourceUIRow = ({ resource }: { resource: Resource }) => {
  return (
    <div className="flex gap-2 w-full justify-between px-6 bg-amber-400 ">
      <div> {resource.name}</div>
      <div>{FormatWithCommas(resource.value)}</div>
      <div> {FormatWithCommas(resource.totalRate)}/s</div>
    </div>
  );
};
