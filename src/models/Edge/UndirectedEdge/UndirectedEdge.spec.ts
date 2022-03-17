import { UndirectedEdge } from './UndirectedEdge';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { ContractVerifier } from '@tgillespie/hash-data-structures';
import { DirectedEdge } from '../DirectedEdge/DirectedEdge';

describe('UndirectedEdge', () => {
    it('keeps Hashable Contract', () => {
        const examples = [
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b')),
            new UndirectedEdge(new NamedVertex('b'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex(' a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a '), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex(' a '), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a '), new NamedVertex('a ')),
            new UndirectedEdge(new NamedVertex('b'), new NamedVertex('b')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('{'), new NamedVertex('}')),
            new UndirectedEdge(new NamedVertex('}'), new NamedVertex('{')),
            new UndirectedEdge(new NamedVertex('longer'), new NamedVertex('name')),
            new UndirectedEdge(new NamedVertex('glfuenegufelg'), new NamedVertex('unafgelgfengfunlegf')),
            new UndirectedEdge(new NamedVertex(''), new NamedVertex('')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('')),
            new UndirectedEdge(new NamedVertex(''), new NamedVertex('nfgeuved')),
        ];

        expect(() => new ContractVerifier(examples).verifyContract()).not.toThrow();
    });

    it('states that it is undirected', () => {
        const someEdge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
        expect(someEdge.isDirected()).toBe(false);
    });

    describe('equals()', () => {
        it('return true for the same edge', () => {
            const edge1 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(edge1.equals(edge2)).toEqual(true);
            expect(edge2.equals(edge1)).toEqual(true);
        });

        it('return true for inverse edge', () => {
            const edge1 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new UndirectedEdge(new NamedVertex('b'), new NamedVertex('a'));

            expect(edge1.equals(edge2)).toEqual(true);
            expect(edge2.equals(edge1)).toEqual(true);
        });

        it('return false for DirectedEdge', () => {
            const directedEdge = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const undirectedEdge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));

            expect(directedEdge.equals(undirectedEdge)).toEqual(false);
            expect(undirectedEdge.equals(directedEdge)).toEqual(false);
        });

        it('return false when messing with the _type', () => {
            const edge1 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            // tslint:disable-next-line:no-string-literal
            edge1['_type'] = 'SomethingElse';

            expect(edge1.equals(edge2)).toEqual(false);
            expect(edge2.equals(edge1)).toEqual(false);
        });

        it('return false when messing with the isDirected return value', () => {
            const edge1 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            const edge2 = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
            edge2.isDirected = () => true;

            expect(edge1.equals(edge2)).toEqual(false);
        });
    });
});
