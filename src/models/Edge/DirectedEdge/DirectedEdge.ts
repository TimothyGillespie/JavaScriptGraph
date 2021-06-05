import Edge from '../Edge/Edge';
import Vertex from '../../Vertex/Vertex/Vertex';

class DirectedEdge<V extends Vertex> extends Edge<V> {
	get from(): V {
		return this.vertexA;
	}

	get to(): V {
		return this.vertexB;
	}

	isDirected(): boolean {
		return true;
	}
}

export default DirectedEdge;
