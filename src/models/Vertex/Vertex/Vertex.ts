import {Hashable} from '@tgillespie/hash-data-structures';

export abstract class Vertex implements Hashable {
    abstract compareTo(other: this): number;

    abstract equals(other: any): boolean;
    abstract hashCode(): number;
}

export function vertexEqual<V extends Vertex>(a: V, b: V) {
	return a.equals(b);
}

export function vertexCompareTo<V extends Vertex>(a: V, b: V) {
	return a.compareTo(b);
}
