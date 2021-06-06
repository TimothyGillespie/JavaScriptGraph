import Vertex from '../Vertex/Vertex/Vertex';

class AdjacencyList<V extends Vertex> {
	protected _adjacencyList: Map<V, V[]>;

	constructor() {
		this._adjacencyList = new Map();
	}

	initVertex(vertex: V) {
		this._adjacencyList.set(vertex, []);
	}

	protected _areAdjacent(from: V, to: V): boolean {
		return this.getAdjacentVertices(from).find((singleVertex) => singleVertex.equals(to)) !== undefined;
	}

	getAdjacentVertices(vertex: V): V[] {
		return this._adjacencyList.get(vertex) ?? [];
	}

	addAdjacency(vertexA: V, vertexB: V) {
		if (this._areAdjacent(vertexA, vertexB)) return;
		this.getAdjacentVertices(vertexA).push(vertexB);
		this.getAdjacentVertices(vertexB).push(vertexA);
	}
}

export default AdjacencyList;