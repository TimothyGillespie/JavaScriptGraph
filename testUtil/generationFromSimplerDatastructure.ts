import DirectedEdge from '../src/models/Edge/DirectedEdge/DirectedEdge';
import NamedVertex from '../src/models/Vertex/NamedVertex/NamedVertex';

export function generateDirectedEdgesWithNameVertex(definition: string[][]): DirectedEdge<NamedVertex>[] {
	return definition.map(
		([vertexNameA, vertexNameB]) => new DirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)),
	);
}

export function generateNamedVertices(definition: string[]): NamedVertex[] {
	return definition.map((vertexName) => new NamedVertex(vertexName));
}
