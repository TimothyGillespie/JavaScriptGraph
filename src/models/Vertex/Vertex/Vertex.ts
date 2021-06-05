abstract class Vertex {
	abstract equals(other: any): boolean;
	abstract compareTo(other: this): number;
}

export function vertexEqual<V extends Vertex>(a: V, b: V) {
	return a.equals(b);
}

export function vertexCompareTo<V extends Vertex>(a: V, b: V) {
	return a.compareTo(b);
}

export default Vertex;
