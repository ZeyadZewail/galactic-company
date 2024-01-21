import { useBearStore as BearStore } from "../stores/Test.ts";

export const Tick = () => {
  const { increase } = BearStore.getState();

  increase(1);
};
