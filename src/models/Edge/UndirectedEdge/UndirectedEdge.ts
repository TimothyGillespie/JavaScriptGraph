import { Edge } from '../EdgeContracts/Edge';
import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export class UndirectedEdge<V extends Vertex> extends Edge<V> {
    protected _type: string = 'UndirectedEdge';

    isDirected(): boolean {
        return false;
    }

    equals(other: Hashable): boolean {
        if (!(other instanceof UndirectedEdge)) return false;
        if (this._type !== other._type) return false;

        return this.isEqualUndirectedEdge(other);
    }

    protected isEqualUndirectedEdge(other: UndirectedEdge<V>): boolean {
        return (
            (!other.isDirected() && this.vertexA.equals(other.vertexA) && this.vertexB.equals(other.vertexB)) ||
            (this.vertexA.equals(other.vertexB) && this.vertexB.equals(other.vertexA))
        );
    }

    hashCode(): number {
        // tslint:disable-next-line:no-bitwise
        return (this.vertexA.hashCode() << 16) + (this.vertexB.hashCode() << 16);
    }
}
