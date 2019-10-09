import * as d3 from "d3";

class CloudGraph {
    /**
     * @param {string} elementId 
     */
    drawRedSquare(elementId) {
        const mySvg = d3.select(elementId).append("svg").attr("width",200).attr("height",200);
        mySvg.append("rect").attr("width","100%").attr("height","100%").attr("fill","red");
    }
}

export default CloudGraph;
	