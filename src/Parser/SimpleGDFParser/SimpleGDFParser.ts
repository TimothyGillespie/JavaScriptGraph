import IStringParser from '../IStringParser';
import Graph from '../../models/Graph/Graph';
import NamedVertex from '../../models/Vertex/NamedVertex/NamedVertex';
import DirectedEdge from '../../models/Edge/DirectedEdge/DirectedEdge';

// This parser is very rudimental and assumes alot
class SimpleGDFParser implements IStringParser<Graph<NamedVertex, DirectedEdge<NamedVertex>>> {
	currentMode: 'none' | 'nodedef' | 'edgedef' = 'none';
	lines: string[] = [];
	currentGraph: Graph<any, any> = new Graph<NamedVertex, DirectedEdge<NamedVertex>>();

	parse(input: string): Graph<NamedVertex, DirectedEdge<NamedVertex>> {
		this.read(input);
		while (this.lines.length > 0) {
			this.parseNextStep();
		}

		return this.currentGraph.copy();
	}

	parseNextStep(): Graph<any, any> | null {
		const nextLine = this.lines.shift();
		if (nextLine === undefined) {
			return null;
		}

		if (nextLine.startsWith('nodedef')) {
			this.currentMode = 'nodedef';
			return this.parseNextStep();
		}

		if (nextLine.startsWith('edgedef')) {
			this.currentMode = 'edgedef';
			return this.parseNextStep();
		}

		if (this.currentMode === 'nodedef') {
			const vertexName = nextLine.trim();
			this.currentGraph.addVertex(new NamedVertex(vertexName));
		}

		if (this.currentMode === 'edgedef') {
			const [vertexNameA, vertexNameB] = nextLine.split(',');
			this.currentGraph.addEdge(new DirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)));
		}

		return this.currentGraph.copy();
	}

	read(input: string): boolean {
		this.lines = input.split('\n');

		return true;
	}
}

export default SimpleGDFParser;
