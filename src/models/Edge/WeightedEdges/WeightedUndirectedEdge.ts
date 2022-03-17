import { Vertex } from '../../Vertex/Vertex/Vertex';
import { UndirectedEdge } from '../UndirectedEdge/UndirectedEdge';
import { Hashable } from '@tgillespie/hash-data-structures';

export class WeightedUndirectedEdge<V extends Vertex> extends UndirectedEdge<V> implements Weightable {
    protected _type: string = 'WeightedUndirectedEdge';

    constructor(vertexA: V, vertexB: V, protected _weight: number) {
        super(vertexA, vertexB);
    }

    getWeight(): number {
        return this._weight;
    }

    equals(other: Hashable): boolean {
        if (!(other instanceof WeightedUndirectedEdge)) return false;
        if (this._type !== other._type) return false;

        return this.isEqualWeightedUndirectedEdge(other);
    }

    protected isEqualWeightedUndirectedEdge(other: WeightedUndirectedEdge<V>): boolean {
        return this.getWeight() === other.getWeight() && super.isEqualUndirectedEdge(other);
    }

    hashCode(): number {
        return super.hashCode() * 2 + this.getWeight();
    }
}
