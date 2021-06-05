import Edge from '../Edge/Edge';
import Vertex from '../../Vertex/Vertex/Vertex';

class UndirectedEdge<V extends Vertex> extends Edge<V> {
	isDirected(): boolean {
		return false;
	}
}

export default UndirectedEdge;
