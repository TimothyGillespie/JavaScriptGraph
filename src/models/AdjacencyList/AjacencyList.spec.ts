import { NamedVertex } from "../Vertex/NamedVertex/NamedVertex";
import { AdjacencyList } from "./AdjacencyList";
import { DirectedEdge, UndirectedEdge } from "../Edge";

const a = new NamedVertex('a');
const b = new NamedVertex('b');
const c = new NamedVertex('c');
const d = new NamedVertex('d');
let adjList: AdjacencyList<NamedVertex>;

describe('AdjacencyList', () => {
    beforeEach(() => {
        adjList = new AdjacencyList();
    });

    it('two different vertices are initially not adjacent', () => {
        adjList.areAdjacent(a, b);
    });

    it.each([a, b])('a vertex is not adjacent to itself initially: NamedVertex %s', (vertex) => {
        expect(adjList.areAdjacent(vertex, vertex)).toBe(false);
    });

    it('adding adjacency will make the same vertices in the same order adjacent', () => {
        const list = new AdjacencyList();
        list.addAdjacency(a, b);
        expect(list.areAdjacent(a, b)).toBe(true);
    });

    it('adding adjacency will make the same vertices in the reverse order adjacent', () => {
        adjList.addAdjacency(a, b);
        expect(adjList.areAdjacent(b, a)).toBe(true);
    });

    it('adding an adjacency twice will make the same vertices in the same order adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, b);
        expect(adjList.areAdjacent(a, b)).toBe(true);
    });

    it('adding an adjacency twice will make the same vertices in the same reverse adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, b);
        expect(adjList.areAdjacent(b, a)).toBe(true);
    });

    it('adding an adjacency once in both orders will make the same vertices in the same reverse adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(b, a);
        expect(adjList.areAdjacent(b, a)).toBe(true);
    });

    it('adding adjacency and then a vertex it will make the same vertices in the same order not adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('adding adjacency and then deleting a vertex it will make the same vertices in the reverse order not adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(b, a)).toBe(false);
    });

    it('adding an adjacency twice and then deleting a vertex it will make the same vertices in the same order not adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, b);
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('adding adjacency and then deleting a vertex twice it will make the same vertices in the reverse order not adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, b);
        adjList.deleteVertex(a)
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(b, a)).toBe(false);
    });

    it('adding adjacency and then deleting a vertex twice it will make the same vertices in the same order not adjacent', () => {
        adjList.addAdjacency(a, b);
        adjList.deleteVertex(a)
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('deleting a not listed vertex works', () => {
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('deleting a not listed vertex does not affect other adjacency', () => {
        adjList.addAdjacency(c, d);
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(c, d)).toBe(true);
    });

    it('deleting a vertex does not affect other adjacency', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(b, c);
        adjList.addAdjacency(c, d);
        adjList.deleteVertex(a)
        expect(adjList.areAdjacent(a, b)).toBe(false);
        expect(adjList.areAdjacent(b, c)).toBe(true);
        expect(adjList.areAdjacent(c, d)).toBe(true);
    });

    it('deleting a directed edge deletes the corresponding adjacency', () => {
        adjList.addAdjacency(a, b);
        adjList.deleteEdge(new DirectedEdge(a, b))
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('deleting a directed edge deletes does not delete other adjacencies', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, c);
        adjList.addAdjacency(b, c);
        adjList.addAdjacency(c, d);
        adjList.deleteEdge(new DirectedEdge(a, b))
        expect(adjList.areAdjacent(a, c)).toBe(true);
        expect(adjList.areAdjacent(b, c)).toBe(true);
        expect(adjList.areAdjacent(c, d)).toBe(true);
    });

    it('deleting an undirected edge deletes the corresponding adjacency', () => {
        adjList.addAdjacency(a, b);
        adjList.deleteEdge(new UndirectedEdge(a, b))
        expect(adjList.areAdjacent(a, b)).toBe(false);
    });

    it('deleting an undirected edge deletes does not delete other adjacencies', () => {
        adjList.addAdjacency(a, c);
        adjList.addAdjacency(b, c);
        adjList.addAdjacency(c, d);
        adjList.deleteEdge(new UndirectedEdge(a, b))
        expect(adjList.areAdjacent(a, b)).toBe(false);
        expect(adjList.areAdjacent(a, c)).toBe(true);
        expect(adjList.areAdjacent(b, c)).toBe(true);
        expect(adjList.areAdjacent(c, d)).toBe(true);
    });

    it('deleting an edge of non-existent vertices does not change the adjacency list', () => {
        adjList.addAdjacency(a, b);
        adjList.addAdjacency(a, c);
        adjList.addAdjacency(b, c);
        adjList.addAdjacency(c, d);
        adjList.deleteEdge(new DirectedEdge(a, b))
        expect(adjList.areAdjacent(a, c)).toBe(true);
        expect(adjList.areAdjacent(b, c)).toBe(true);
        expect(adjList.areAdjacent(c, d)).toBe(true);
    });

});