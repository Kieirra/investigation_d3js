import { select, scaleOrdinal, schemeDark2, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3";

class ForceDirectedGraph {
    /**
     * @param {string} svgDomId
     * @param {{ "persons": any[]; "links": any[]; "family-links": any[]; }} datasets
     */
    constructor(svgDomId, datasets) {
        this.datasets = datasets;
        this.svg = select(svgDomId);
        this.width = +this.svg.attr("width"); // use + to use a number and not a string (kind of parseInt())
        this.height = +this.svg.attr("height");
    }

    draw() {
        this.configureNodeStyle();
        this.configureText();
        const allLinks = this.datasets.links.concat(this.datasets["family-links"]);
        this.configureLinkStyle(allLinks);
        this.configureSimulation(allLinks);
    }

    configureNodeStyle() {
        const color = scaleOrdinal(schemeDark2);

        this.nodes = this.svg
            .append("g")
            .selectAll("person")
            .data(this.datasets.persons)
            .enter()
            .append("circle") // Créer un element SVG circle 
            .attr("stroke-width", 3)
            .attr("stroke", "black")
            .attr("fill", d => d.role === "victime" ? "red" : color(d.alibi));
    }

    configureText() {
        this.text = this.svg.append("g")
            .selectAll("person")
            .data(this.datasets.persons)
            .enter()
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", d => d.role === "victime" ? "1.5em" : "1em")
            .attr("font-weight", "bold")
            .attr("fill", d => d.role === "victime" ? "red" : "black")
            .text(d => `${d.name}`);
    }

    configureLinkStyle(allLinks) {
        this.links = this.svg.append("g")
            .selectAll("line")
            .data(allLinks)
            .enter()
            .append("line")
            .attr("stroke-width", 3)
            .attr("style", "stroke:rgb(0,255,0)");
    }

    configureSimulation(allLinks) {
        forceSimulation()
            // @ts-ignore
            .force("link", forceLink().id(d => d.name)) // Use in ticked() to know which data to joins
            .force("charge", forceManyBody().strength(10)) // Less strength = more space between link
            .force("center", forceCenter(this.width / 2, this.height / 2))
            // @ts-ignore
            .force('collide', forceCollide(d => d.id === d.name ? 10 : 40))
            .nodes(this.datasets.persons)
            .on("tick", this.ticked.bind(this))
            .force("link")
            // @ts-ignore
            .links(allLinks);
    }

    /**
     * Update function for simulation
     */
    ticked() {
        this.nodes
            .attr("cx", d => d.x)     // (Do not use d.position.x here)        
            .attr("cy", d => d.y)
            .attr("r", d => d.role === "victime" ? 10 : (11 - d.alibi) * 2)

        this.links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        this.text
            .attr("x", d => d.x + 20)
            .attr("y", d => d.y + 5)
    }

}

export default ForceDirectedGraph;