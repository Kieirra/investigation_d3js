import { select, scaleOrdinal, schemeDark2, scaleLinear } from "d3";

const MARGIN = 30;
const MAX_X_DATASETS = 135;
const MAX_Y_DATASETS = 135;

class CloudGraph {

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
        this.drawPersons();
        this.drawNames();
        this.svg.on("mouseover", this.displayLinks.bind(this));
        this.svg.on("mouseout", this.removeLinks.bind(this));
    }

    drawPersons() {
        const color = scaleOrdinal(schemeDark2);
        const xScale = this.getXScale();
        const yScale = this.getYScale();

        this.svg
            .selectAll("circle")
            .data(this.datasets.persons)
            .enter()
            .append("circle")
            .attr("r", d => d.role === "victime" ? 10 : (11 - d.alibi) * 1.2)
            .attr("cx", d => xScale(d.position.x))
            .attr("cy", d => yScale(d.position.y))
            .attr("fill", d => d.role === "victime" ? "red" : color("" + d.alibi))
            .attr("stroke", "black");
    }

    drawNames() {
        const xScale = this.getXScale();
        const yScale = this.getYScale();

        this.svg
            .selectAll("coord")
            .data(this.datasets.persons)
            .enter()
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", d => d.role === "victime" ? "1.5em" : "1em")
            .attr("font-weight", "bold")
            .attr("x", d => xScale(d.position.x) - 20)
            .attr("y", d => yScale(d.position.y) + 5)
            .attr("fill", "black")
            .text(d => d.name);
    }

    displayLinks() {
        const xScale = this.getXScale();
        const yScale = this.getYScale();

        this.svg
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.datasets.links)
            .enter()
            .append("line")
            .attr("stroke-width", 3)
            .attr("style", "stroke:rgb(0,255,0)")
            .attr("x1", d => xScale(d.source.position.x))
            .attr("y1", d => yScale(d.source.position.y))
            .attr("x2", d => xScale(d.target.position.x))
            .attr("y2", d => yScale(d.target.position.y));
        /**
         *  Code above works because we force links between 'links' and persons with joinLinksToPersons() in index.js        
         *  otherwise we should do this : 
         * .attr("x1", d => xScale(this.datasets.persons.find(p => p.name === d.source).position.x))
         * .attr("y1", d => yScale(this.datasets.persons.find(p => p.name === d.source).position.y))
         * .attr("x2", d => xScale(this.datasets.persons.find(p => p.name === d.target).position.x))
         * .attr("y2", d => yScale(this.datasets.persons.find(p => p.name === d.target).position.y));
         */
    }

    removeLinks() {
        this.svg.selectAll("g.links").remove();
    }

    getXScale() {
        return scaleLinear()
            .domain([0, MAX_X_DATASETS])
            .range([MARGIN, this.width - MARGIN]);
    }

    getYScale() {
        return scaleLinear()
            .domain([0, MAX_Y_DATASETS])
            .range([MARGIN, this.height - MARGIN]);
    }
}

export default CloudGraph;