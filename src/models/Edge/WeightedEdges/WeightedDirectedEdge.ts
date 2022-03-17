import { DirectedEdge } from '../DirectedEdge/DirectedEdge';
import { Vertex } from '../../Vertex/Vertex/Vertex';

export class WeightedDirectedEdge<V extends Vertex> extends DirectedEdge<V> implements Weightable {
    constructor(vertexA: V, vertexB: V, protected _weight: number) {
        super(vertexA, vertexB);
    }

    getWeight(): number {
        return this._weight;
    }
}
