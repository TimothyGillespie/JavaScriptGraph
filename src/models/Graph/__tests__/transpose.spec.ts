import { Graph } from '../Graph';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { DirectedEdge } from '../../Edge/DirectedEdge/DirectedEdge';
import { Edge } from '../../Edge/EdgeContracts/Edge';
import { UndirectedEdge } from '../../Edge/UndirectedEdge/UndirectedEdge';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

let a: NamedVertex;
let b: NamedVertex;
let c: NamedVertex;
let d: NamedVertex;
let e: NamedVertex;

describe('g.transpose()', () => {
	beforeEach(() => {
		graph = new Graph(true);
		a = new NamedVertex('a');
		b = new NamedVertex('b');
		c = new NamedVertex('c');
		d = new NamedVertex('d');
		e = new NamedVertex('e');
	});

	describe('Normal Cases', () => {
		it('Edge list is correct after transposing', () => {
			graph.addEdge(new DirectedEdge(a, b));
			graph.transpose();

			expect(graph.getListOfEdges()).toEqual([new DirectedEdge(b, a)]);
		});

		it('Adjacency matrix is correct after transposing', () => {
			graph.addEdge(new DirectedEdge(a, b), new DirectedEdge(b, c), new UndirectedEdge(d, e));
			graph.transpose();

			const matrix = graph.getAdjacencyMatrix();

			expect(matrix.get(a, b)).toEqual(false);
			expect(matrix.get(b, a)).toEqual(true);
			expect(matrix.get(b, c)).toEqual(false);
			expect(matrix.get(c, b)).toEqual(true);
			expect(matrix.get(d, e)).toEqual(true);
			expect(matrix.get(e, d)).toEqual(true);
		});

		it('Graph equals itself afer transposing twice', () => {
			graph.addEdge(new DirectedEdge(a, b), new DirectedEdge(b, c), new UndirectedEdge(d, e));
			const graphCopy = graph.copy();
			graph.transpose();
			graph.transpose();

			expect(graph).toEqual(graphCopy);
		});
	});
});
