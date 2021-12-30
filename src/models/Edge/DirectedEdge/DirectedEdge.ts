import { Edge } from '../Edge/Edge';
import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export class DirectedEdge<V extends Vertex> extends Edge<V> {
	get from(): V {
		return this.vertexA;
	}

	get to(): V {
		return this.vertexB;
	}

	isDirected(): boolean {
		return true;
	}

	equals(other: Hashable): boolean {
		if (!(other instanceof DirectedEdge)) return false;
		if (!other.isDirected()) return false;

		return this.vertexA.equals(other.vertexA) && this.vertexB.equals(other.vertexB);
	}

	hashCode(): number {
		// tslint:disable-next-line:no-bitwise
		return (this.vertexA.hashCode() << 24) - (this.vertexB.hashCode() << 8);
	}
}
