import { useBearStore } from "../stores/Test.ts";
import { useMetaStore } from "../stores/MetaStore.ts";
import { usePageVisibility } from "./usePageVisibility.tsx";
import { useEffect } from "react";
import { Tick } from "../util/Tick.ts";

export const UseTicker = () => {
  const { bears } = useBearStore();
  const { lastTickDate, clearTicker, startTicker, setLastTickDate } =
    useMetaStore();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    startTicker();

    // Clear interval on component unmount
    return () => clearTicker();
  }, []); // Empty dependency array means this effect runs only on mount

  useEffect(() => {
    // You can perform actions here based on visibility
    if (!isPageVisible) {
      const currentDate = new Date();
      console.log("User has tabbed out at " + currentDate);
      console.log("bears " + bears);
      // Perform any action when the user tabs out
      setLastTickDate(currentDate);
      clearTicker(); // Set interval to 1 second
    } else {
      if (lastTickDate) {
        console.log("User is back at " + new Date());
        const secondsMissed = Math.floor(
          (new Date().getTime() - new Date(lastTickDate).getTime()) / 1000,
        );
        Tick(secondsMissed);
        console.log("difference:", secondsMissed);
      }
      console.log("bears " + bears);
      // Perform any action when the user comes back
      startTicker();
    }
  }, [isPageVisible]);
};
