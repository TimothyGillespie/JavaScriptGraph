import {Graph} from "../Graph";
import {NamedVertex} from "../../Vertex/NamedVertex/NamedVertex";
import {DirectedEdge, Edge, UndirectedEdge} from "../../Edge";
import { expectEdgeListsAreEqual } from "../../../../testUtil/expectEdgeListsAreEqual";

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

const a = new NamedVertex('a');
const b = new NamedVertex('b');
const c = new NamedVertex('c');
const d = new NamedVertex('d');
const e = new NamedVertex('e');
const f = new NamedVertex('f');
const g = new NamedVertex('g');

const directedEdges = [
    new DirectedEdge(c, a),
    new DirectedEdge(c, b),
    new DirectedEdge(d, c),
    new DirectedEdge(e, c),
    new DirectedEdge(b, d),
    new DirectedEdge(d, b),
    new DirectedEdge(g, b),
    new DirectedEdge(g, d),
    new DirectedEdge(c, c),
    new DirectedEdge(d, d),
];

const undirectedEdges = [
    new UndirectedEdge(a, b),
    new UndirectedEdge(c, f),
    new UndirectedEdge(c, g),
    new UndirectedEdge(a, e),
    new UndirectedEdge(f, g),
    new UndirectedEdge(c, c),
    new UndirectedEdge(g, g),
];

describe('Test retrieving attached, incoming and outgoing edges for a vertex', () => {
    beforeEach(() => {
        graph = new Graph();
        graph.addVertex(a, b, c, d, e, f, g);
    });

    /*
     * Attached
     */

    describe('g.getAttachedEdges(v)', () => {

        it('works with a directed graph', () => {
            graph.addEdge(...directedEdges);
            const attachedEdges = graph.getAttachedEdges(c);
            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(c, a),
                new DirectedEdge(c, b),
                new DirectedEdge(d, c),
                new DirectedEdge(e, c),
                new DirectedEdge(c, c),
            ]);
        });

        it('works with an undirected graph', () => {
            graph.addEdge(...undirectedEdges);
            const attachedEdges = graph.getAttachedEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });

        it('works with a mixed direction graph', () => {
            graph.addEdge(...directedEdges, ...undirectedEdges);
            const attachedEdges = graph.getAttachedEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(c, a),
                new DirectedEdge(c, b),
                new DirectedEdge(d, c),
                new DirectedEdge(e, c),
                new DirectedEdge(c, c),
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });
    });

    /*
     * Outgoing
     */

    describe('g.getOutgoingEdges(v)', () => {

        it('works with a directed graph', () => {
            graph.addEdge(...directedEdges);
            const attachedEdges = graph.getOutgoingEdges(c);
            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(c, a),
                new DirectedEdge(c, b),
                new DirectedEdge(c, c),
            ]);
        });

        it('works with an undirected graph', () => {
            graph.addEdge(...undirectedEdges);
            const attachedEdges = graph.getOutgoingEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });

        it('works with a mixed direction graph', () => {
            graph.addEdge(...directedEdges, ...undirectedEdges);
            const attachedEdges = graph.getOutgoingEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(c, a),
                new DirectedEdge(c, b),
                new DirectedEdge(c, c),
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });
    });

    /*
     * Incoming
     */

    describe('g.getIncomingEdges(v)', () => {

        it('works with a directed graph', () => {
            graph.addEdge(...directedEdges);
            const attachedEdges = graph.getIncomingEdges(c);
            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(d, c),
                new DirectedEdge(e, c),
                new DirectedEdge(c, c),
            ]);
        });

        it('works with an undirected graph', () => {
            graph.addEdge(...undirectedEdges);
            const attachedEdges = graph.getIncomingEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });

        it('works with a mixed direction graph', () => {
            graph.addEdge(...directedEdges, ...undirectedEdges);
            const attachedEdges = graph.getIncomingEdges(c);

            expectEdgeListsAreEqual(attachedEdges, [
                new DirectedEdge(d, c),
                new DirectedEdge(e, c),
                new DirectedEdge(c, c),
                new UndirectedEdge(c, f),
                new UndirectedEdge(c, g),
                new UndirectedEdge(c, c),
            ]);
        });
    });
});
