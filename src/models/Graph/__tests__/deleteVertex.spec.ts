import {Graph} from "../Graph";
import {DirectedEdge} from "../../Edge";
import {
    generateDirectedEdgesWithNameVertex,
    generateNamedVertices
} from "../../../../testUtil/generationFromSimplerDatastructure";
import {NamedVertex} from "../../Vertex/NamedVertex/NamedVertex";
import {expectVerticesListsAreEqual} from "../../../../testUtil/expectVerticesListsAreEqual";
import expectEdgeListsAreEqual from "../../../../testUtil/expectEdgeListsAreEqual";

describe('graph.deleteVertex(v)', () => {

    let graph: Graph<NamedVertex, DirectedEdge<NamedVertex>>;
    const vertices = ['a', 'b', 'c', 'd'];
    const edges = [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c']
    ];

    beforeEach(() => {
        graph = new Graph(false);
        graph.addVertex(...generateNamedVertices(vertices));
        graph.addEdge(...generateDirectedEdgesWithNameVertex(edges));
    });

    it('graph is initially as expected', () => {
        // list of vertices
        expectVerticesListsAreEqual(generateNamedVertices(vertices), graph.getListOfVertices());

        // list of edges
        expectEdgeListsAreEqual(generateDirectedEdgesWithNameVertex(edges), graph.getListOfEdges());

        // (sparse) adjacency matrix
        for(const vertexA of generateNamedVertices(vertices)) {
            for (const vertexB of generateNamedVertices(vertices)) {
                if (edges.filter(x => x[0] === vertexA.name && x[1] === vertexB.name).length === 0) {
                    expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(false);
                } else {
                    expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(true);
                }
            }
        }

        // adjacency list
        const adjacencyList = graph.getAdjacencyList();
        expectVerticesListsAreEqual(adjacencyList.getAdjacentVertices(new NamedVertex('a')), generateNamedVertices(['b', 'c']));
        expectVerticesListsAreEqual(adjacencyList.getAdjacentVertices(new NamedVertex('b')), generateNamedVertices(['a', 'c']));
        expectVerticesListsAreEqual(adjacencyList.getAdjacentVertices(new NamedVertex('c')), generateNamedVertices(['a', 'b']));
        expectVerticesListsAreEqual(adjacencyList.getAdjacentVertices(new NamedVertex('d')), []);

    });

    describe('vertex list is correct', () => {
        it.each(vertices)('removes the vertex %s from the vertex list', (input) => {
            graph.deleteVertex(new NamedVertex(input));
            expect(graph.getListOfVertices().length).toBe(3);
            expect(graph.getListOfVertices()).toEqual(generateNamedVertices(vertices).filter(x => x.name !== input));
        });
    });

    describe('edge list is correct', () => {
        it.each(['a', 'b', 'c'])('removes the vertex %s and receives the correct edge count', (input) => {
            graph.deleteVertex(new NamedVertex(input));
            expect(graph.getListOfEdges().length).toBe(1);
        });

        it('removes the vertex d and receives the correct edge count', () => {
            graph.deleteVertex(new NamedVertex('d'));
            expect(graph.getListOfEdges().length).toBe(3);
        });

        it.each(vertices)('removes the vertex %s and no edge contains the vertex anymore', (input) => {
            const removeVertex = new NamedVertex(input);
            graph.deleteVertex(removeVertex);
            expect(graph.getListOfEdges().some(x => x.vertexA.equals(removeVertex) || x.vertexB.equals(removeVertex))).toBe(false);
        });
    });

    describe('adjacencyList is correct', () => {
        it.each(vertices)('removes the vertex %s and finds an empty list (default) for that vertex', (input) => {
            const removedVertex = new NamedVertex(input);
            graph.deleteVertex(removedVertex);
            expect(graph.getAdjacencyList().getAdjacentVertices(removedVertex).length).toBe(0);
        });

        it.each(vertices)('removes the vertex %s and does not find it in other adjacency lists', (input) => {
            const removedVertex = new NamedVertex(input);
            graph.deleteVertex(removedVertex);
            for(const maybeAdjacentToRemoved of generateNamedVertices(vertices)) {
                expect(graph.getAdjacencyList().getAdjacentVertices(maybeAdjacentToRemoved).filter(x => x.equals(input)).length).toBe(0);
            }
        });
    });

    describe('adjacencyMatrix is correct', () => {
        it.each(['a', 'b', 'c', 'd'])('removes the vertex %s and the matrix shows false for whenever %s is the first value', (input) => {
            const removedVertex = new NamedVertex(input);
            graph.deleteVertex(removedVertex);
            for(const singleVertex of vertices) {
                expect(graph.getAdjacencyMatrix().get(removedVertex, new NamedVertex(singleVertex))).toBe(false);
            }
        });

        it.each(['a', 'b', 'c', 'd'])('removes the vertex %s and the matrix shows false for whenever %s is the second value', (input) => {
            const removedVertex = new NamedVertex(input);
            graph.deleteVertex(removedVertex);
            for(const singleVertex of vertices) {
                expect(graph.getAdjacencyMatrix().get(new NamedVertex(singleVertex), removedVertex)).toBe(false);
            }
        });

        it.each(['a', 'b', 'c', 'd'])('removes the vertex %s and adjacencies not related to that node are still the same', (input) => {
            const removedVertex = new NamedVertex(input);
            graph.deleteVertex(removedVertex);
            const verticesWithoutRemoved = generateNamedVertices(vertices.filter(x => x !== input));
            for(const vertexA of verticesWithoutRemoved) {
                for (const vertexB of verticesWithoutRemoved) {
                    if (edges.filter(x => x[0] === vertexA.name && x[1] === vertexB.name).length === 0) {
                        expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(false);
                    } else {
                        expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(true);
                    }
                }
            }
        });

    });

});
