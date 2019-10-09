import { forceSimulation, forceLink } from "d3";
import Smiley from "./src/Smiley";
import CloudGraph from "./src/CloudGraph";
import JSON_DATA from "./assets/data.json"
import BubbleGraph from "./src/BubbleGraph";
import ForceDirectedGraph from "./src/ForceDirectedGraph";

document.addEventListener("DOMContentLoaded", () => {

    // Only use to simplify reading
    joinLinksWithPersonInJsonData();

    const smiley = new Smiley("#smiley");
    smiley.draw();

    const cloudGraph = new CloudGraph("#cloudGraph", JSON_DATA);
    cloudGraph.draw();

    const bubbleGraph = new BubbleGraph("#bubbleGraph", JSON_DATA);
    bubbleGraph.draw();

    const forceDirectedGraph = new ForceDirectedGraph("#forceDirectedGraph", JSON_DATA);
    forceDirectedGraph.draw();
})

function joinLinksWithPersonInJsonData() {
    // @ts-ignore
    const linkForce = forceLink().id(d => d.name);
    forceSimulation()
        .force("link", linkForce)
        .nodes(JSON_DATA.persons)
        .force("link")
        .links(JSON_DATA.links.concat(JSON_DATA["family-links"]));
}
