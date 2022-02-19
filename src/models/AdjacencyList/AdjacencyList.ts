import { Vertex } from '../Vertex/Vertex/Vertex';
import { MutableHashMap } from '@tgillespie/hash-data-structures';
import { Edge } from '../Edge';

export class AdjacencyList<V extends Vertex> {
	protected _adjacencyList: MutableHashMap<V, V[]>;

	constructor() {
		this._adjacencyList = new MutableHashMap<V, V[]>();
	}

	initVertex(vertex: V): void {
		this._adjacencyList.set(vertex, []);
	}

	areAdjacent(from: V, to: V): boolean {
		return this.getAdjacentVertices(from).find((singleVertex) => singleVertex.equals(to)) !== undefined;
	}

	getAdjacentVertices(vertex: V): V[] {
		return this._adjacencyList.get(vertex) ?? [];
	}

	addAdjacency(vertexA: V, vertexB: V): void {
		if (this.areAdjacent(vertexA, vertexB)) return;
		this.getAdjacentVertices(vertexA).push(vertexB);
		this.getAdjacentVertices(vertexB).push(vertexA);
	}

	deleteVertex(vertex: V): void {
		this._adjacencyList.delete(vertex);
		for (const [key, value] of this._adjacencyList.entries()) {
			this._adjacencyList.set(
				key,
				value.filter((x) => !x.equals(vertex)),
			);
		}
	}

	deleteEdge(edge: Edge<V>): void {
		const previousDirectedEdgeVertices = this._adjacencyList.get(edge.vertexA);
		if (previousDirectedEdgeVertices) {
			this._adjacencyList.set(
				edge.vertexA,
				previousDirectedEdgeVertices.filter((x) => !x.equals(edge.vertexB)),
			);
		}

		// Because it is about adjacency it must be done for both directed and undirected edges
		const previousOppositeEdge = this._adjacencyList.get(edge.vertexB);
		if (previousOppositeEdge) {
			this._adjacencyList.set(
				edge.vertexB,
				previousOppositeEdge.filter((x) => !x.equals(edge.vertexA)),
			);
		}
	}
}
