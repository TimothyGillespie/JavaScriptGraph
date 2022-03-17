import { WeightedUndirectedEdge } from './WeightedUndirectedEdge';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';

describe('WeightedUndirectedEdge', () => {
    it.each([-Number.MAX_SAFE_INTEGER - 1, -4689, -49, -20, -1, 0, 1, 20, 49, 4689, Number.MAX_SAFE_INTEGER + 1])(
        'It can take in and process the weight %d',
        (weight) => {
            const edge = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), weight);
            expect(edge.getWeight()).toEqual(weight);
        }
    );

    it('The vertices are passed in the same order', () => {
        const edge = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
        expect(edge.vertexA.name).toEqual('a');
        expect(edge.vertexB.name).toEqual('b');
    });
});
