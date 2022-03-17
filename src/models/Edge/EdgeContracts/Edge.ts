import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export abstract class Edge<V extends Vertex> implements Hashable {
    constructor(public vertexA: V, public vertexB: V) {}

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

export const edgeEqual = <V extends Vertex, E extends Edge<V>>(a: E, b: E): boolean => a.equals(b as Hashable);

export const edgeCompareTo = <V extends Vertex, E extends Edge<V>>(a: E, b: E): number => a.compareTo(b);
