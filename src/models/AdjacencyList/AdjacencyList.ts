import Vertex from '../Vertex/Vertex/Vertex';

class AdjacencyList<V extends Vertex> {
	protected data: Map<V, V[]>;

	constructor() {
		this.data = new Map();
	}

	initVertex(vertex: V) {
		this.data.set(vertex, []);
	}

	isAdjacent(from: V, to: V): boolean {
		return this.getAdjacentVertices(from).find((singleVertex) => singleVertex.compareTo(to)) !== undefined;
	}

	getAdjacentVertices(from: V): V[] {
		return this.data.get(from) ?? [];
	}

	addAdjacency(from: V, to: V) {
		if (this.isAdjacent(from, to)) return;

		this.getAdjacentVertices(from).push(to);
	}
}

export default AdjacencyList;
