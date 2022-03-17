import { Graph } from '../Graph';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { DirectedEdge, UndirectedEdge } from '../../Edge';
import { expectEdgeListsAreEqual } from '../../../../testUtil/expectEdgeListsAreEqual';

const a = new NamedVertex('a');
const b = new NamedVertex('b');
const c = new NamedVertex('c');

describe('g.getEdges(a, b)', () => {
    it('return an emtpy array when the graph is empty', () => {
        expect(new Graph().getEdges(a, b)).toEqual([]);
    });

    it('it finds a directed edge when given the same order', () => {
        const g = new Graph(true);
        const edge = new DirectedEdge(a, b);
        g.addEdge(edge);

        expect(g.getEdges(a, b)).toEqual([edge]);
    });

    it('it finds no directed edge when given the opposite order', () => {
        const g = new Graph(true);
        const edge = new DirectedEdge(a, b);
        g.addEdge(edge);

        expect(g.getEdges(b, a)).toEqual([]);
    });

    it('it finds an undirected edge no matter the given order', () => {
        const g = new Graph(true);
        const edge = new UndirectedEdge(a, b);
        g.addEdge(edge);

        expect(g.getEdges(a, b)).toEqual([edge]);
        expect(g.getEdges(b, a)).toEqual([edge]);
    });

    it('returns an empty array for a given, unconnected vertex', () => {
        const g = new Graph(true);
        const edge = new UndirectedEdge(a, b);
        g.addEdge(edge);

        expect(g.getEdges(a, c)).toEqual([]);
        expect(g.getEdges(b, c)).toEqual([]);
        expect(g.getEdges(c, a)).toEqual([]);
        expect(g.getEdges(c, b)).toEqual([]);
    });

    it('returns two fitting edges (directed and undirected if fitting)', () => {
        const g = new Graph(true);
        const edge1 = new UndirectedEdge(a, b);
        const edge2 = new DirectedEdge(a, b);
        g.addEdge(edge1, edge2);

        expectEdgeListsAreEqual(g.getEdges(a, b), [edge1, edge2]);
    });

    it('returns only the fitting edges (directed and undirected)', () => {
        const g = new Graph(true);
        const edge1 = new UndirectedEdge(a, b);
        const edge2 = new DirectedEdge(a, b);
        g.addEdge(edge1, edge2);

        expectEdgeListsAreEqual(g.getEdges(b, a), [edge1]);
    });

    it('returns only the fitting edges (2x directed)', () => {
        const g = new Graph(true);
        const edge1 = new DirectedEdge(a, b);
        const edge2 = new DirectedEdge(b, a);
        g.addEdge(edge1, edge2);

        expectEdgeListsAreEqual(g.getEdges(b, a), [edge2]);
    });
});
