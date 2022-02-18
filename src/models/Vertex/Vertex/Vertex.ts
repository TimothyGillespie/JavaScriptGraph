import { Hashable } from '@tgillespie/hash-data-structures';

export abstract class Vertex implements Hashable {
	abstract compareTo(other: this): number;

	abstract equals(other: any): boolean;
	abstract hashCode(): number;
}

export const vertexEqual = <V extends Vertex>(a: V, b: V): boolean => a.equals(b);

export const vertexCompareTo = <V extends Vertex>(a: V, b: V): number => a.compareTo(b);
