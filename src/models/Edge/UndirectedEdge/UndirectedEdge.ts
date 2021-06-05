import Edge from '../Edge/Edge';
import Vertex from '../../Vertex/Vertex/Vertex';

class UndirectedEdge<V extends Vertex> extends Edge<V> {
	isDirected(): boolean {
		return false;
	}

	equals(other: Edge<V>): boolean {
		if (other.isDirected()) return false;

		return super.equals(other) || (this.vertexA.equals(other.vertexB) && this.vertexB.equals(other.vertexA));
	}
}

export default UndirectedEdge;
