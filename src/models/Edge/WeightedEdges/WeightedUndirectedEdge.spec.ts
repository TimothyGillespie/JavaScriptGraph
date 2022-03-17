/* tslint:disable:no-string-literal */
import { WeightedUndirectedEdge } from './WeightedUndirectedEdge';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { WeightedDirectedEdge } from './WeightedDirectedEdge';
import { ContractVerifier } from '@tgillespie/hash-data-structures';
import { UndirectedEdge } from '../UndirectedEdge/UndirectedEdge';

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

    describe('equals()', () => {
        it('returns false for a undirected edge (symmetric)', () => {
            const weightedEdge = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const edge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(weightedEdge.equals(edge)).toEqual(false);
            expect(edge.equals(weightedEdge)).toEqual(false);
        });

        it('returns false for a different weights', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 1);

            expect(weightedEdge1.equals(weightedEdge2)).toEqual(false);
            expect(weightedEdge2.equals(weightedEdge1)).toEqual(false);
        });

        it('returns false for a WeightedUndirectedEdge with the same weight', () => {
            const directedWeightedEdge = new WeightedDirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const undirectedWeightedEdge = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);

            expect(directedWeightedEdge.equals(undirectedWeightedEdge)).toEqual(false);
            expect(undirectedWeightedEdge.equals(directedWeightedEdge)).toEqual(false);
        });

        it('returns true for its inverse', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            // Second one to make sure it is not looking at the instance
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('b'), new NamedVertex('a'), 0);

            expect(weightedEdge1.equals(weightedEdge2)).toEqual(true);
            expect(weightedEdge2.equals(weightedEdge1)).toEqual(true);
        });

        it('returns true for itself', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            // Second one to make sure it is not looking at the instance
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);

            expect(weightedEdge1.equals(weightedEdge2)).toEqual(true);
            expect(weightedEdge2.equals(weightedEdge1)).toEqual(true);
        });

        it('returns false when the _type is changed', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            weightedEdge2['_type'] = 'SomethingElse';

            expect(weightedEdge1.equals(weightedEdge2)).toEqual(false);
            expect(weightedEdge2.equals(weightedEdge1)).toEqual(false);
        });
    });

    describe('hashCode()', () => {
        it('differs from the DirectedEdge with weight of 0', () => {
            const weightedEdge = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const edge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(weightedEdge.hashCode()).not.toEqual(edge.hashCode());
        });

        it('differs for the same vertices but different weights', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0);
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 1);

            expect(weightedEdge1.hashCode()).not.toEqual(weightedEdge2.hashCode());
        });

        it('is the same for the same inputs', () => {
            const weightedEdge1 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 15);
            const weightedEdge2 = new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 15);

            expect(weightedEdge1.hashCode()).toEqual(weightedEdge2.hashCode());
        });
    });

    it('holds hashable contract', () => {
        new ContractVerifier([
            new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('b'), 0),
            new WeightedUndirectedEdge(new NamedVertex('b'), new NamedVertex('a'), 456),
            new WeightedUndirectedEdge(new NamedVertex('b'), new NamedVertex('a'), 456),
            new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('a'), 48),
            new WeightedUndirectedEdge(new NamedVertex(' a'), new NamedVertex('a'), 0),
            new WeightedUndirectedEdge(new NamedVertex('a '), new NamedVertex('a'), -156),
            new WeightedUndirectedEdge(new NamedVertex(' a '), new NamedVertex('a'), -156),
            new WeightedUndirectedEdge(new NamedVertex('a a'), new NamedVertex('a'), -156),
            new WeightedUndirectedEdge(new NamedVertex('a '), new NamedVertex('a '), -156),
            new WeightedUndirectedEdge(new NamedVertex('b'), new NamedVertex('b'), 0),
            new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex('a'), 0),
            new WeightedUndirectedEdge(new NamedVertex('{'), new NamedVertex('}'), 1),
            new WeightedUndirectedEdge(new NamedVertex('}'), new NamedVertex('{'), 2),
            new WeightedUndirectedEdge(new NamedVertex('longer'), new NamedVertex('name'), -1),
            new WeightedUndirectedEdge(new NamedVertex('glfuenegufelg'), new NamedVertex('unafgelgfengfunlegf'), 4564),
            new WeightedUndirectedEdge(new NamedVertex(''), new NamedVertex(''), 48497498897),
            new WeightedUndirectedEdge(new NamedVertex('a'), new NamedVertex(''), -4894948),
            new WeightedUndirectedEdge(new NamedVertex(''), new NamedVertex('nfgeuved'), 4548),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b')),
        ]).verifyContract();
    });
});
