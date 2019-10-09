import { select, arc } from "d3";

class Smiley {
    /**
     * @param {string} svgDomId 
     */
    constructor(svgDomId) {
        this.svg = select(svgDomId);
    }

    draw() {
        this.drawFace();
        this.drawEye(60, 70);
        this.drawEye(60 + 80, 70);
        this.drawMouth();
    }

    drawFace() {
        return this.svg.append("circle")
            .attr("r", 100)
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("fill", "yellow");
    }

    drawEye(x, y) {
        return this.svg.append("circle")
            .attr("r", 10)
            .attr("cx", x)
            .attr("cy", y)
            .attr("fill", "black");
    }

    drawMouth() {
        // Voir documentation D3.js https://github.com/d3/d3-shape/blob/v1.3.5/README.md#arc
        const mouth = arc()
            .innerRadius(70)
            .outerRadius(80)
            .startAngle(Math.PI / 2)
            .endAngle(Math.PI * 3 / 2);

        // Voir documentation comment faire un arc en svg : https://developer.mozilla.org/fr/docs/Web/SVG/Tutoriel/Paths 
        const path = this.svg.append("g")
            .attr("transform", 'translate(100, 100)')
            .append("path")
            .attr("d", mouth)
            .attr("stroke", "black");
    }
}

export default Smiley;
