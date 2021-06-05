import NamedVertex from '../../Vertex/NamedVertex/NamedVertex';
import Graph from '../Graph';
import Edge from '../../Edge/Edge/Edge';
import DirectedEdge from '../../Edge/DirectedEdge/DirectedEdge';
import expectVerticesListsAreEqual from '../../../../testUtil/expectVerticesListsAreEqual';
import UndirectedEdge from '../../Edge/UndirectedEdge/UndirectedEdge';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

let a: NamedVertex;
let b: NamedVertex;
let c: NamedVertex;
let d: NamedVertex;
let e: NamedVertex;

describe('g.getChildNodes(v)', () => {
	beforeEach(() => {
		graph = new Graph(true);
		a = new NamedVertex('a');
		b = new NamedVertex('b');
		c = new NamedVertex('c');
		d = new NamedVertex('d');
		e = new NamedVertex('e');
		graph.addVertex(a, b, c, d, e);
	});

	describe('Normal Cases', () => {
		describe('Graph has fewer vertices than edges', () => {
			it('Works correctly with a directed Graph', () => {
				graph.addEdge(new DirectedEdge(a, b), new DirectedEdge(a, c), new DirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), []);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});

			it('Works correctly with an undirected Graphs', () => {
				graph.addEdge(new UndirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(c), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});

			it('Works correctly with a mixed Graphs', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});
		});

		describe('Graph has more edges than vertices', () => {
			it('Works correctly with a directed Graph', () => {
				graph.addEdge(
					new DirectedEdge(a, b),
					new DirectedEdge(b, c),
					new DirectedEdge(c, d),
					new DirectedEdge(d, e),
					new DirectedEdge(e, a),

					new DirectedEdge(a, c),
				);
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), [c]);
				expectVerticesListsAreEqual(graph.getChildNodes(c), [d]);
				expectVerticesListsAreEqual(graph.getChildNodes(d), [e]);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});

			it('Works correctly with an undirected Graphs', () => {
				graph.addEdge(new UndirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(c), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});

			it('Works correctly with a mixed Graphs', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});
		});
	});

	describe('Edge Cases', () => {
		describe('Graph has fewer vertices than edges', () => {
			it('Works does not add duplicate vetices', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, b), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [b, e]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(c), []);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), [a]);
			});

			it('List itself with self-loop in a directed graph', () => {
				graph.addEdge(new DirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), []);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), []);
			});

			it('List itself with self-loop in a undirected graph', () => {
				graph.addEdge(new UndirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), []);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), []);
			});

			it('List itself only once with two self-loop in a mixed graph', () => {
				graph.addEdge(new DirectedEdge(a, a), new UndirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildNodes(a), [a]);
				expectVerticesListsAreEqual(graph.getChildNodes(b), []);
				expectVerticesListsAreEqual(graph.getChildNodes(c), []);
				expectVerticesListsAreEqual(graph.getChildNodes(d), []);
				expectVerticesListsAreEqual(graph.getChildNodes(e), []);
			});
		});
	});
});
