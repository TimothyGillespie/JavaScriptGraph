import { Graph } from '../Graph';
import { DirectedEdge, Edge, edgeEqual, UndirectedEdge } from '../../Edge';
import {
	generateDirectedEdgesWithNameVertex,
	generateNamedVertices,
	generateUndirectedEdgesWithNameVertex,
} from '../../../../testUtil/generationFromSimplerDatastructure';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { expectVerticesListsAreEqual } from '../../../../testUtil/expectVerticesListsAreEqual';
import expectEdgeListsAreEqual from '../../../../testUtil/expectEdgeListsAreEqual';
import * as _ from 'lodash';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;
const vertices = ['a', 'b', 'c', 'd'];
const edges = [
	['a', 'b'],
	['b', 'c'],
	['a', 'c'],
];

const directedEdges = generateDirectedEdgesWithNameVertex(edges);
const undirectedEdges = generateUndirectedEdgesWithNameVertex(edges);

const expectInitialStateShared = () => {
	// list of vertices
	expectVerticesListsAreEqual(generateNamedVertices(vertices), graph.getListOfVertices());

	// list of edges
	expectEdgeListsAreEqual(generateDirectedEdgesWithNameVertex(edges), graph.getListOfEdges());

	// adjacency list
	const adjacencyList = graph.getAdjacencyList();
	expectVerticesListsAreEqual(
		adjacencyList.getAdjacentVertices(new NamedVertex('a')),
		generateNamedVertices(['b', 'c']),
	);
	expectVerticesListsAreEqual(
		adjacencyList.getAdjacentVertices(new NamedVertex('b')),
		generateNamedVertices(['a', 'c']),
	);
	expectVerticesListsAreEqual(
		adjacencyList.getAdjacentVertices(new NamedVertex('c')),
		generateNamedVertices(['a', 'b']),
	);
	expectVerticesListsAreEqual(adjacencyList.getAdjacentVertices(new NamedVertex('d')), []);
};

const expectInitialStateDirected = () => {
	expectInitialStateShared();

	// (sparse) adjacency matrix
	for (const vertexA of generateNamedVertices(vertices)) {
		for (const vertexB of generateNamedVertices(vertices)) {
			if (edges.filter((x) => x[0] === vertexA.name && x[1] === vertexB.name).length === 0) {
				expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(false);
			} else {
				expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(true);
			}
		}
	}
};

const expectInitialStateUndirected = () => {
	expectInitialStateShared();

	// (sparse) adjacency matrix
	for (const vertexA of generateNamedVertices(vertices)) {
		for (const vertexB of generateNamedVertices(vertices)) {
			// Difference between undirected and directed is this line
			if (
				edges.filter(
					(x) =>
						(x[0] === vertexA.name && x[1] === vertexB.name) ||
						(x[1] === vertexA.name && x[0] === vertexB.name),
				).length === 0
			) {
				expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(false);
			} else {
				expect(graph.getAdjacencyMatrix().get(vertexA, vertexB)).toBe(true);
			}
		}
	}
};

const getNonExistentDirectedEdges = () => {
	const nonExistentEdges = [];
	for (const vertexA of vertices) {
		for (const vertexB of vertices) {
			if (edges.filter((x) => x[0] === vertexA && x[1] === vertexB).length > 0) continue;

			nonExistentEdges.push(new DirectedEdge(new NamedVertex(vertexA), new NamedVertex(vertexB)));
		}
	}

	return nonExistentEdges;
};

const getNonExistentUndirectedEdges = () => {
	const nonExistentEdges = [];
	for (const vertexA of vertices) {
		for (const vertexB of vertices) {
			if (
				edges.filter((x) => (x[0] === vertexA && x[1] === vertexB) || (x[1] === vertexA && x[0] === vertexB))
					.length > 0
			)
				continue;

			nonExistentEdges.push(new UndirectedEdge(new NamedVertex(vertexA), new NamedVertex(vertexB)));
		}
	}

	return nonExistentEdges;
};

describe('graph.deleteVertex(v)', () => {
	beforeEach(() => {
		graph = new Graph(false);
		graph.addVertex(...generateNamedVertices(vertices));
	});

	afterEach(() => {
		// Vertices list should never change
		expectVerticesListsAreEqual(generateNamedVertices(vertices), graph.getListOfVertices());
	});

	describe('directed edges', () => {
		beforeEach(() => {
			graph.addEdge(...generateDirectedEdgesWithNameVertex(edges));
		});

		it('graph is initially as expected', () => {
			expectInitialStateDirected();
		});

		it('number of non existent edges is correct', () => {
			const nonExistentEdges = getNonExistentDirectedEdges();

			// Total number of possible edges: 4^2
			// Existing edges: 3
			// Fictional Edges: 4^2 - 3
			expect(nonExistentEdges.length).toBe(13);
		});

		it('removing non-existent edges all at once changes nothing', () => {
			const nonExistentEdges = getNonExistentDirectedEdges();

			// Removing all at once
			graph.deleteEdge(...nonExistentEdges);
			expectInitialStateDirected();
		});

		it('removing non-existent edges one by one changes nothing', () => {
			const nonExistentEdges = getNonExistentDirectedEdges();

			for (const singleNonExistentEdge of nonExistentEdges) {
				graph.deleteEdge(singleNonExistentEdge);
				expectInitialStateDirected();
			}
		});

		describe('edge list is correct', () => {
			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and receives the correct edge count',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(graph.getListOfEdges().length).toBe(2);
					expectEdgeListsAreEqual(
						graph.getListOfEdges(),
						generateDirectedEdgesWithNameVertex(edges).filter((x) => !x.equals(removedEdge)),
					);
				},
			);
		});

		describe('adjacencyList is correct', () => {
			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and removes the entry of $vertexB.name in the list of $vertexA.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexA)
							.filter((x) => x.equals(removedEdge.vertexB)).length,
					).toBe(0);
				},
			);

			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and removes the entry of $vertexA.name in the list of $vertexB.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexB)
							.filter((x) => x.equals(removedEdge.vertexA)).length,
					).toBe(0);
				},
			);

			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and contains other vertices still in the list of $vertexA.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					// Works because every node contained in an edge is adjacent to two nodes
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexA)
							.filter((x) => !x.equals(removedEdge.vertexB)).length,
					).toBe(1);
				},
			);

			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and contains other vertices still in the list of $vertexB.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					// Works because every node contained in an edge is adjacent to two nodes
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexB)
							.filter((x) => !x.equals(removedEdge.vertexA)).length,
					).toBe(1);
				},
			);
		});

		describe('adjacencyMatrix is correct', () => {
			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and sets the deleted edge to false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(graph.getAdjacencyMatrix().get(removedEdge.vertexA, removedEdge.vertexB)).toBe(false);
				},
			);

			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and does not change the other edges to false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					const nonDeleted = _.differenceWith(directedEdges, [removedEdge], edgeEqual);
					for (const singleEdge of nonDeleted) {
						expect(graph.getAdjacencyMatrix().get(singleEdge.vertexA, singleEdge.vertexB)).toBe(true);
					}
				},
			);

			it.each(directedEdges)(
				'removes the edge $vertexA.name -> $vertexB.name and all non-existent edges are still false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					for (const singleEdge of getNonExistentDirectedEdges()) {
						expect(graph.getAdjacencyMatrix().get(singleEdge.vertexA, singleEdge.vertexB)).toBe(false);
					}
				},
			);
		});
	});

	describe('undirected edges', () => {
		beforeEach(() => {
			graph.addEdge(...generateUndirectedEdgesWithNameVertex(edges));
		});

		it('graph is initially as expected', () => {
			expectInitialStateUndirected();
		});

		it('number of non existent edges is correct', () => {
			const nonExistentEdges = getNonExistentUndirectedEdges();

			// Total number of possible edges: 4^2
			// Existing edges: 3 * 2
			// Fictional Edges: 4^2 - 3 * 2
			expect(nonExistentEdges.length).toBe(10);
		});

		it('removing non-existent edges all at once changes nothing', () => {
			const nonExistentEdges = getNonExistentUndirectedEdges();

			// Removing all at once
			graph.deleteEdge(...nonExistentEdges);
			expectInitialStateUndirected();
		});

		it('removing non-existent edges one by one changes nothing', () => {
			const nonExistentEdges = getNonExistentUndirectedEdges();

			for (const singleNonExistentEdge of nonExistentEdges) {
				graph.deleteEdge(singleNonExistentEdge);
				expectInitialStateUndirected();
			}
		});

		describe('edge list is correct', () => {
			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and receives the correct edge count',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(graph.getListOfEdges().length).toBe(2);
					expectEdgeListsAreEqual(
						graph.getListOfEdges(),
						generateUndirectedEdgesWithNameVertex(edges).filter((x) => !x.equals(removedEdge)),
					);
				},
			);

			it.each(undirectedEdges)(
				'removes the transposed edge $vertexB.name <-> $vertexA.name and receives the correct edge count',
				(removedEdge) => {
					graph.deleteEdge(new UndirectedEdge(removedEdge.vertexB, removedEdge.vertexA));
					expect(graph.getListOfEdges().length).toBe(2);
					expectEdgeListsAreEqual(
						graph.getListOfEdges(),
						generateUndirectedEdgesWithNameVertex(edges).filter((x) => !x.equals(removedEdge)),
					);
				},
			);
		});

		describe('adjacencyList is correct', () => {
			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and removes the entry of $vertexB.name in the list of $vertexA.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexA)
							.filter((x) => x.equals(removedEdge.vertexB)).length,
					).toBe(0);
				},
			);

			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and removes the entry of $vertexA.name in the list of $vertexB.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexB)
							.filter((x) => x.equals(removedEdge.vertexA)).length,
					).toBe(0);
				},
			);

			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and contains other vertices still in the list of $vertexA.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					// Works because every node contained in an edge is adjacent to two nodes
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexA)
							.filter((x) => !x.equals(removedEdge.vertexB)).length,
					).toBe(1);
				},
			);

			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and contains other vertices still in the list of $vertexB.name',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					// Works because every node contained in an edge is adjacent to two nodes
					expect(
						graph
							.getAdjacencyList()
							.getAdjacentVertices(removedEdge.vertexB)
							.filter((x) => !x.equals(removedEdge.vertexA)).length,
					).toBe(1);
				},
			);
		});

		describe('adjacencyMatrix is correct', () => {
			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and sets the deleted edge to false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					expect(graph.getAdjacencyMatrix().get(removedEdge.vertexA, removedEdge.vertexB)).toBe(false);
					expect(graph.getAdjacencyMatrix().get(removedEdge.vertexB, removedEdge.vertexA)).toBe(false);
				},
			);

			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and does not change the other edges to false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					const nonDeleted = _.differenceWith(undirectedEdges, [removedEdge], edgeEqual);
					for (const singleEdge of nonDeleted) {
						expect(graph.getAdjacencyMatrix().get(singleEdge.vertexA, singleEdge.vertexB)).toBe(true);
					}
				},
			);

			it.each(undirectedEdges)(
				'removes the edge $vertexA.name <-> $vertexB.name and all non-existent edges are still false',
				(removedEdge) => {
					graph.deleteEdge(removedEdge);
					for (const singleEdge of getNonExistentUndirectedEdges()) {
						expect(graph.getAdjacencyMatrix().get(singleEdge.vertexA, singleEdge.vertexB)).toBe(false);
					}
				},
			);
		});
	});
});
