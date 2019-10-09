import { select, scaleOrdinal, schemeCategory10, pack, hierarchy } from "d3";

class BubbleGraph {

    /**
     * @param {string} svgDomId
     * @param {{ "persons": any[*]; "links": any[]; "family-links": any[]; }} datasets
     */
    constructor(svgDomId, datasets) {
        this.datasets = datasets;
        this.svg = select(svgDomId);
        this.width = +this.svg.attr("width"); // use + to use a number and not a string (kind of parseInt())
        this.height = +this.svg.attr("height");
    }

    draw() {
        const bubble = pack()
            .size([this.width, this.height])
            .padding(1.5);

        // Bubble chart Need this json format : {"children": Array}
        const root = hierarchy({ "children": this.datasets.persons })
            .sum(person => this.computeKillCapacity(person));  // Compute the "Count" to calculate circle radius value

        this.drawNodes(bubble, root);
        this.drawNames(bubble, root);
    }

    drawNodes(bubble, root) {
        const color = scaleOrdinal(schemeCategory10);
        this.svg.selectAll("circle")
            .data(bubble(root).descendants())
            .enter()
            .append("circle")
            .filter(this.displayOnlySuspects)
            .attr("r", d => d.r)
            .attr("stroke-width", 3)
            .attr("stroke", "black")
            .attr("fill", d => color("" + d.r))
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    }

    displayOnlySuspects(bubbleSingleData) {
        return !bubbleSingleData.children && bubbleSingleData.data.name !== "Annie";
    }

    drawNames(bubble, root) {
        this.svg.selectAll("text")
            .data(bubble(root).descendants())
            .enter()
            .append("text")
            .filter(d => !d.children && d.data.name !== "Annie") // Do not display root bubble
            .attr("font-family", "sans-serif")
            .attr("font-size", "0.8em")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("x", d => d.x - d.data.name.length * 4) // Hack to center (not really good but dc (: )
            .attr("y", d => d.y)
            .text(d => `${d.data.name} ${d.value}`);
    }

    /**
     * @params {JSONObject}
     */
    computeKillCapacity(person) {
        // Weight (multiplier) and characteristic here are totaly subjectif
        const alibi = (5 - person.alibi) * 4;
        const arme = person.permisArme === "oui" ? 20 : -10;
        const age = 5 * (35 - Math.abs(35 - person.age)) / 35;
        const taille = 10 * (170 - Math.abs(170 - person.taille)) / 170;
        const vision = (5 - person.vision) * 2;
        const killScore = Math.ceil(alibi + vision + arme + age + taille)
        return killScore < 5 ? 5 : killScore;
    }
}

export default BubbleGraph;