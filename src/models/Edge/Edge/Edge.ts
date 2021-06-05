import Vertex from '../../Vertex/Vertex/Vertex';

abstract class Edge<V extends Vertex> {
	vertexA: V;
	vertexB: V;

	constructor(vertexA: V, vertexB: V) {
		this.vertexA = vertexA;
		this.vertexB = vertexB;
	}

	abstract isDirected(): boolean;
}

export default Edge;
