import CloudGraph from "./CloudGraph.js";

/**
 *  @type {CloudGraph} cloudGraph 
 */
let cloudGraph;
beforeEach(() => {
	cloudGraph = new CloudGraph();
})

it("should be defined after instanciation", () => {
	expect(cloudGraph).toBeDefined();
})
	