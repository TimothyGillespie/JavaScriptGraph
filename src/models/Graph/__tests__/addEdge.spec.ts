import Graph from '../Graph';
import NamedVertex from '../../Vertex/NamedVertex/NamedVertex';
import DirectedEdge from '../../Edge/DirectedEdge/DirectedEdge';
import UndirectedEdge from '../../Edge/UndirectedEdge/UndirectedEdge';
import Edge, { edgeCompareTo } from '../../Edge/Edge/Edge';
import expectVerticesListsAreEqual from '../../../../testUtil/expectVerticesListsAreEqual';
import * as _ from 'lodash';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

let a: NamedVertex;
let b: NamedVertex;
let c: NamedVertex;
let edge1: Edge<NamedVertex>;
let edge2: Edge<NamedVertex>;

describe('g.addEdge()', () => {
	beforeEach(() => {
		graph = new Graph(true);
		a = new NamedVertex('a');
		b = new NamedVertex('b');
		c = new NamedVertex('c');
	});

	describe('Normal Cases', () => {
		it('Adding an edge adds it to the edge list as well', () => {
			edge1 = new DirectedEdge(a, b);
			graph.addEdge(edge1);

			expect(graph.getListOfEdges()).toEqual([edge1]);
		});

		it('Adding two edges adds them to the edge list as well', () => {
			edge1 = new DirectedEdge(a, b);
			edge2 = new DirectedEdge(b, c);
			graph.addEdge(edge1, edge2);

			expectVerticesListsAreEqual(graph.getListOfEdges(), [edge1, edge2]);
		});

		it('Adding an directed edge updates the adjacency matrix asymmetrically', () => {
			edge1 = new DirectedEdge(a, b);
			graph.addEdge(edge1);

			expect(graph.getAdjacencyMatrix().get(a, b)).toBe(true);
			expect(graph.getAdjacencyMatrix().get(b, a)).toBe(false);
		});

		it('Adding an undirected edge updates the adjacency matrix symmetrically', () => {
			edge1 = new UndirectedEdge(a, b);
			graph.addEdge(edge1);

			expect(graph.getAdjacencyMatrix().get(a, b)).toBe(true);
			expect(graph.getAdjacencyMatrix().get(b, a)).toBe(true);
		});

		it('Adding the mirrored directed edge updates the adjacency matrix symmetrically', () => {
			edge1 = new DirectedEdge(a, b);
			edge2 = new DirectedEdge(b, a);
			graph.addEdge(edge1, edge2);

			expect(graph.getAdjacencyMatrix().get(a, b)).toBe(true);
			expect(graph.getAdjacencyMatrix().get(b, a)).toBe(true);
		});

		it('Adding a directed Edge update the adjacency list accordingly', () => {
			edge1 = new DirectedEdge(a, b);
			graph.addEdge(edge1);

			expect(graph.getAdjacencyList().getAdjacentVertices(a)).toEqual([b]);
			expect(graph.getAdjacencyList().getAdjacentVertices(b)).toEqual([a]);
		});

		it('Adding an undirected Edge update the adjacency list accordingly', () => {
			edge1 = new UndirectedEdge(a, b);
			graph.addEdge(edge1);

			expect(graph.getAdjacencyList().getAdjacentVertices(a)).toEqual([b]);
			expect(graph.getAdjacencyList().getAdjacentVertices(b)).toEqual([a]);
		});
	});

	// I know, technically they are all "edge cases" ;)
	describe('Edge Cases', () => {
		it('Adding the same edge twice does not add it the edgeList twice', () => {
			edge1 = new DirectedEdge(a, b);
			edge2 = new DirectedEdge(a, b);
			graph.addEdge(edge1, edge2);

			expectVerticesListsAreEqual(graph.getListOfEdges(), [edge1]);
		});

		it('Adding the mirrored directed edge adds a second edge', () => {
			edge1 = new DirectedEdge(a, b);
			edge2 = new DirectedEdge(b, a);
			graph.addEdge(edge1, edge2);

			expectVerticesListsAreEqual(graph.getListOfEdges(), [edge1, edge2]);
		});

		it('Adding the mirrored undirected edge adds no further edge', () => {
			edge1 = new UndirectedEdge(a, b);
			edge2 = new UndirectedEdge(b, a);
			graph.addEdge(edge1, edge2);

			expect(graph.getListOfEdges().length).toEqual(1);
			const entry = graph.getListOfEdges()[0];
			expect(_.isEqual(entry, edge1) || _.isEqual(entry, edge2)).toBe(true);
		});

		it('Adding an directed edge twice updates the adjacency matrix asymmetrically', () => {
			edge1 = new DirectedEdge(a, b);
			edge2 = new DirectedEdge(a, b);
			graph.addEdge(edge1, edge2);

			expect(graph.getAdjacencyMatrix().get(a, b)).toBe(true);
			expect(graph.getAdjacencyMatrix().get(b, a)).toBe(false);
		});

		it('Adding an undirected edge twice updates the adjacency matrix symmetrically', () => {
			edge1 = new UndirectedEdge(a, b);
			edge2 = new UndirectedEdge(a, b);
			graph.addEdge(edge1, edge2);

			expect(graph.getAdjacencyMatrix().get(a, b)).toBe(true);
			expect(graph.getAdjacencyMatrix().get(b, a)).toBe(true);
		});
	});
});
