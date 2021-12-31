import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { Graph } from '../Graph';
import { Edge } from '../../Edge';
import { DirectedEdge } from '../../Edge';
import { UndirectedEdge } from '../../Edge';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

let a: NamedVertex;
let b: NamedVertex;
let c: NamedVertex;
let d: NamedVertex;
let e: NamedVertex;

describe('g.*dfsIterator()', () => {
	beforeEach(() => {
		graph = new Graph(true);
		a = new NamedVertex('a');
		b = new NamedVertex('b');
		c = new NamedVertex('c');
		d = new NamedVertex('d');
		e = new NamedVertex('e');
		graph.addVertex(a, b, c, d, e);
	});

	describe('Normal Case', () => {
		it('Works for directed graph', () => {
			graph.addEdge(new DirectedEdge(a, c), new DirectedEdge(c, b), new DirectedEdge(e, c));

			const actualOrderOfIteration = [];
			const iterator = graph.dfsIterator();
			for (const iteration of iterator) {
				actualOrderOfIteration.push(iteration.currentVertex);
			}

			expect(actualOrderOfIteration).toEqual([a, c, b, d, e]);
		});

		it('Works for undirected graph', () => {
			graph.addEdge(new UndirectedEdge(a, c), new UndirectedEdge(c, b), new UndirectedEdge(e, c));

			const actualOrderOfIteration = [];
			const iterator = graph.dfsIterator();
			for (const iteration of iterator) {
				actualOrderOfIteration.push(iteration.currentVertex);
			}

			expect(actualOrderOfIteration).toEqual([a, c, b, e, d]);
		});

		it('Returns last taken edge correctly', () => {
			const edge1 = new DirectedEdge(a, c);
			const edge2 = new DirectedEdge(c, b);
			const edge3 = new DirectedEdge(e, c);
			graph.addEdge(edge1, edge2, edge3);

			const actualOrderOfIteration = [];
			const iterator = graph.dfsIterator();
			for (const iteration of iterator) {
				actualOrderOfIteration.push(iteration.takenEdge);
			}

			expect(actualOrderOfIteration).toEqual([null, edge1, edge2, null, null]);
		});
	});
});
