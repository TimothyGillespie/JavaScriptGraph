import { Graph } from '../Graph';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { DirectedEdge } from '../../Edge/DirectedEdge/DirectedEdge';
import { expectVerticesListsAreEqual } from '../../../../testUtil/expectVerticesListsAreEqual';

let graph: Graph<NamedVertex, DirectedEdge<NamedVertex>>;
let a: NamedVertex;
let b: NamedVertex;

describe('g.addVertex()', () => {
	beforeEach(() => {
		graph = new Graph();
		a = new NamedVertex('a');
		b = new NamedVertex('b');
	});

	describe('Normal Cases', () => {
		it('Adding a vertex adds it to the list of vertices', () => {
			graph.addVertex(a);
			expect(graph.getListOfVertices()).toEqual([a]);
		});

		it('Adding two vertices adds both to the list of vertices', () => {
			graph.addVertex(a, b);
			expectVerticesListsAreEqual(graph.getListOfVertices(), [a, b]);
		});

		it('Adding a vertex add it to the adjacency list', () => {
			graph.addVertex(a);
			expect(graph.getAdjacencyList().getAdjacentVertices(a)).toEqual([]);
		});
	});

	describe('Edge Cases', () => {
		it('Adding the same vertex twice does not add the vertex twice in the list', () => {
			const secondA = new NamedVertex('a');
			graph.addVertex(a, secondA);

			expect(graph.getListOfVertices()).toEqual([a]);
		});
	});
});
