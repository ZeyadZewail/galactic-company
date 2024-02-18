import { useBearStore as BearStore } from "../stores/Test.ts";
import { useMetaStore as MetaStore } from "../stores/MetaStore.ts";

export const CreateInterval = () =>
  setInterval(() => {
    Tick();
  }, 1000);

export const Tick = (count?: number) => {
  const { bears, increase } = BearStore.getState();
  const { setLastTickDate } = MetaStore.getState();

  console.log("bears " + bears);
  setLastTickDate(new Date());
  if (count && count > -1) {
    increase(count);
  } else {
    increase(1);
  }
};
