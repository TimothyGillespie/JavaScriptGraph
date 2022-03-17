import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { DirectedEdge } from './DirectedEdge';
import { ContractVerifier } from '@tgillespie/hash-data-structures';
import { UndirectedEdge } from '../UndirectedEdge/UndirectedEdge';

describe('DirectedEdge', () => {
    it('keeps Hashable Contract', () => {
        const examples = [
            new DirectedEdge(new NamedVertex('a'), new NamedVertex('b')),
            new DirectedEdge(new NamedVertex('b'), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex(' a'), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex('a '), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex(' a '), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex('a a'), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex('a '), new NamedVertex('a ')),
            new DirectedEdge(new NamedVertex('b'), new NamedVertex('b')),
            new DirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new DirectedEdge(new NamedVertex('{'), new NamedVertex('}')),
            new DirectedEdge(new NamedVertex('}'), new NamedVertex('{')),
            new DirectedEdge(new NamedVertex('longer'), new NamedVertex('name')),
            new DirectedEdge(new NamedVertex('glfuenegufelg'), new NamedVertex('unafgelgfengfunlegf')),
            new DirectedEdge(new NamedVertex(''), new NamedVertex('')),
            new DirectedEdge(new NamedVertex('a'), new NamedVertex('')),
            new DirectedEdge(new NamedVertex(''), new NamedVertex('nfgeuved')),
        ];

        expect(() => new ContractVerifier(examples).verifyContract()).not.toThrow();
    });

    it('states that it is directed', () => {
        const someEdge = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
        expect(someEdge.isDirected()).toBe(true);
    });

    describe('equals()', () => {
        it('return true for the same edge', () => {
            const edge1 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(edge1.equals(edge2)).toEqual(true);
            expect(edge2.equals(edge1)).toEqual(true);
        });

        it('return false for inverse edge', () => {
            const edge1 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new DirectedEdge(new NamedVertex('b'), new NamedVertex('a'));

            expect(edge1.equals(edge2)).toEqual(false);
            expect(edge2.equals(edge1)).toEqual(false);
        });

        it('return false for UndirectedEdge', () => {
            const directedEdge = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const undirectedEdge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(directedEdge.equals(undirectedEdge)).toEqual(false);
            expect(undirectedEdge.equals(directedEdge)).toEqual(false);
        });

        it('return false when messing with the _type', () => {
            const edge1 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            // tslint:disable-next-line:no-string-literal
            edge1['_type'] = 'SomethingElse';

            expect(edge1.equals(edge2)).toEqual(false);
            expect(edge2.equals(edge1)).toEqual(false);
        });

        it('return false when messing with the isDirected return value', () => {
            const edge1 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            edge2.isDirected = () => false;

            expect(edge1.equals(edge2)).toEqual(false);
        });
    });
});
