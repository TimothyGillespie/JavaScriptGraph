import DirectedEdge from '../src/models/Edge/DirectedEdge/DirectedEdge';
import NamedVertex from '../src/models/Vertex/NamedVertex/NamedVertex';
import UndirectedEdge from '../src/models/Edge/UndirectedEdge/UndirectedEdge';

export function generateDirectedEdgesWithNameVertex(definition: string[][]): DirectedEdge<NamedVertex>[] {
	return definition.map(
		([vertexNameA, vertexNameB]) => new DirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)),
	);
}

export function generateUndirectedEdgesWithNameVertex(definition: string[][]): UndirectedEdge<NamedVertex>[] {
	return definition.map(
		([vertexNameA, vertexNameB]) => new UndirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)),
	);
}

export function generateNamedVertices(definition: string[]): NamedVertex[] {
	return definition.map((vertexName) => new NamedVertex(vertexName));
}
