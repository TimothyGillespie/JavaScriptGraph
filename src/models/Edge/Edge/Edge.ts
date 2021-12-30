import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export abstract class Edge<V extends Vertex> implements Hashable {
	vertexA: V;
	vertexB: V;

	constructor(vertexA: V, vertexB: V) {
		this.vertexA = vertexA;
		this.vertexB = vertexB;
	}

	transpose(): void {
		const temp = this.vertexA;
		this.vertexA = this.vertexB;
		this.vertexB = temp;
	}

	compareTo(other: this): number {
		const aCompare = this.vertexA.compareTo(other.vertexA);
		if (aCompare !== 0) return aCompare;

		return this.vertexB.compareTo(other.vertexB);
	}

	abstract isDirected(): boolean;

	abstract equals(other: Hashable): boolean;
	abstract hashCode(): number;
}

export function edgeEqual<V extends Vertex, E extends Edge<V>>(a: E, b: E) {
	return a.equals(b as Hashable);
}

export function edgeCompareTo<V extends Vertex, E extends Edge<V>>(a: E, b: E): number {
	return a.compareTo(b);
}
