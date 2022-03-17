import { DirectedEdge } from '../DirectedEdge/DirectedEdge';
import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export class WeightedDirectedEdge<V extends Vertex> extends DirectedEdge<V> implements Weightable {
    protected _type: string = 'WeightedDirectedEdge';

    constructor(vertexA: V, vertexB: V, protected _weight: number) {
        super(vertexA, vertexB);
    }

    getWeight(): number {
        return this._weight;
    }

    equals(other: Hashable): boolean {
        if (!(other instanceof WeightedDirectedEdge)) return false;
        if (this._type !== other._type) return false;

        return this.isEqualWeightedDirectedEdge(other);
    }

    protected isEqualWeightedDirectedEdge(other: WeightedDirectedEdge<V>): boolean {
        return this.getWeight() === other.getWeight() && super.isEqualDirectedEdge(other);
    }

    hashCode(): number {
        return super.hashCode() * 2 + this.getWeight();
    }
}
