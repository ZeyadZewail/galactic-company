import { useMetaStore } from "../stores/MetaStore.ts";
import { usePageVisibility } from "./usePageVisibility.tsx";
import { useEffect } from "react";
import { Tick } from "../util/Tick.ts";
import toast from "react-hot-toast";

export const UseTicker = ({ init }: { init: boolean }) => {
  // const { data } = useResourceStore();
  const { lastTickDate, clearTicker, startTicker, setLastTickDate } =
    useMetaStore();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    if (init) {
      startTicker();
    }

    // Clear interval on component unmount
    return () => clearTicker();
  }, [init]); // Empty dependency array means this effect runs only on mount

  const ParseDifferenceSinceLastOnline = () => {
    if (lastTickDate) {
      // console.log("User is back at " + new Date());
      const secondsMissed = Math.floor(
        (new Date().getTime() - new Date(lastTickDate).getTime()) / 1000,
      );
      Tick(secondsMissed);
      if (secondsMissed > 0) {
        toast(`Welcome back! ${secondsMissed} seconds have passed!`);
      }
    }
    // console.log("data " + JSON.stringify(data));

    // Perform any action when the user comes back
    startTicker();
  };

  useEffect(() => {
    if (init) {
      // You can perform actions here based on visibility
      if (!isPageVisible) {
        const currentDate = new Date();
        // console.log("User has tabbed out at " + currentDate);
        // console.log("data " + JSON.stringify(data));
        // Perform any action when the user tabs out
        setLastTickDate(currentDate);
        clearTicker(); // Set interval to 1 second
      } else {
        ParseDifferenceSinceLastOnline();
      }
    }
  }, [isPageVisible, init]);
};
