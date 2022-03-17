import { Vertex } from '../../Vertex/Vertex/Vertex';
import { UndirectedEdge } from '../UndirectedEdge/UndirectedEdge';

export class WeightedUndirectedEdge<V extends Vertex> extends UndirectedEdge<V> implements Weightable {
    constructor(vertexA: V, vertexB: V, protected _weight: number) {
        super(vertexA, vertexB);
    }

    getWeight(): number {
        return this._weight;
    }
}
