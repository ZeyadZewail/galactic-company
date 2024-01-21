export default () => {
  self.addEventListener("message", () => {
    // const data = event.data;
    performIntensiveTask();
  });

  function performIntensiveTask() {
    setInterval(() => {
      console.log("webworker tick");
      self.postMessage(1);
    }, 1000);
  }
};
