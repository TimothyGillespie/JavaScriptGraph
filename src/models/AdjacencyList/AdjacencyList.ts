import { Vertex } from '../Vertex/Vertex/Vertex';
import { MutableHashMap } from '@tgillespie/hash-data-structures';
import { Edge } from '../Edge';

export class AdjacencyList<V extends Vertex> {
	protected _adjacencyList: MutableHashMap<V, V[]>;

	constructor() {
		this._adjacencyList = new MutableHashMap<V, V[]>();
	}

	areAdjacent(from: V, to: V): boolean {
		return this.getAdjacentVertices(from).find((singleVertex) => singleVertex.equals(to)) !== undefined;
	}

	getAdjacentVertices(vertex: V): V[] {
		return this._adjacencyList.get(vertex) ?? [];
	}

	addAdjacency(vertexA: V, vertexB: V): void {
		if (this.areAdjacent(vertexA, vertexB)) return;
		this._adjacencyList.set(vertexA, [...this.getAdjacentVertices(vertexA),vertexB]);
		this._adjacencyList.set(vertexB, [...this.getAdjacentVertices(vertexB),vertexA]);
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
		const vertexAList = this._adjacencyList.get(edge.vertexA) ?? [];
		const newVertexAList = vertexAList.filter((x) => !x.equals(edge.vertexB));
		if(newVertexAList.length > 0) {
			this._adjacencyList.set(
				edge.vertexA,
				newVertexAList,
			);
		} else {
			this._adjacencyList.delete(
				edge.vertexA
			);
		}

		// Because it is about adjacency it must be done for both directed and undirected edges
		const vertexBList = this._adjacencyList.get(edge.vertexB) ?? [];
		const newVertexBList = vertexBList.filter((x) => !x.equals(edge.vertexA));
		if(newVertexBList.length > 0) {
			this._adjacencyList.set(
				edge.vertexB,
				newVertexBList,
			);
		} else {
			this._adjacencyList.delete(
				edge.vertexB
			);
		}
	}
}
