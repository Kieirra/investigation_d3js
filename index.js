import CloudGraph from "./src/cloudgraph/CloudGraph";

document.addEventListener("DOMContentLoaded", () => {
    const cloudGraph = new CloudGraph();
    cloudGraph.drawRedSquare("#graph1");
})
