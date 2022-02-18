import {DirectedEdge, NamedVertex, UndirectedEdge} from "../src";

export const generateDirectedEdgesWithNameVertex = (definition: string[][]): DirectedEdge<NamedVertex>[] =>
	definition.map(
		([vertexNameA, vertexNameB]) => new DirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)),
	);

export const generateUndirectedEdgesWithNameVertex = (definition: string[][]): UndirectedEdge<NamedVertex>[] =>
	definition.map(
		([vertexNameA, vertexNameB]) => new UndirectedEdge(new NamedVertex(vertexNameA), new NamedVertex(vertexNameB)),
	);


export const generateNamedVertices = (definition: string[]): NamedVertex[] =>
	definition.map((vertexName) => new NamedVertex(vertexName));

