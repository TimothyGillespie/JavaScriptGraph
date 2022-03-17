import { Edge } from '../EdgeContracts/Edge';
import { Vertex } from '../../Vertex/Vertex/Vertex';
import { Hashable } from '@tgillespie/hash-data-structures';

export class DirectedEdge<V extends Vertex> extends Edge<V> {
    protected _type: string = 'DirectedEdge';

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
        if (this._type !== other._type) return false;

        return this.isEqualDirectedEdge(other);
    }

    protected isEqualDirectedEdge(other: DirectedEdge<V>): boolean {
        if (this.isDirected() !== other.isDirected()) return false;

        return this.vertexA.equals(other.vertexA) && this.vertexB.equals(other.vertexB);
    }

    hashCode(): number {
        // tslint:disable-next-line:no-bitwise
        return (this.vertexA.hashCode() << 24) - (this.vertexB.hashCode() << 8);
    }
}
