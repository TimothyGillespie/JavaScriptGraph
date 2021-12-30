import {NamedVertex} from '../../Vertex/NamedVertex/NamedVertex';
import {Graph} from '../Graph';
import {Edge} from '../../Edge/Edge/Edge';
import {DirectedEdge} from '../../Edge/DirectedEdge/DirectedEdge';
import {expectVerticesListsAreEqual} from '../../../../testUtil/expectVerticesListsAreEqual';
import {UndirectedEdge} from '../../Edge/UndirectedEdge/UndirectedEdge';

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
	});

	describe('Normal Cases', () => {
		describe('Graph has fewer vertices than edges', () => {
			it('Works correctly with a directed Graph', () => {
				graph.addEdge(new DirectedEdge(a, b), new DirectedEdge(a, c), new DirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), []);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});

			it('Works correctly with an undirected Graphs', () => {
				graph.addEdge(new UndirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(c), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});

			it('Works correctly with a mixed Graphs', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
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
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), [c]);
				expectVerticesListsAreEqual(graph.getChildVertices(c), [d]);
				expectVerticesListsAreEqual(graph.getChildVertices(d), [e]);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});

			it('Works correctly with an undirected Graphs', () => {
				graph.addEdge(new UndirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(c), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});

			it('Works correctly with a mixed Graphs', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, c), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, c, e]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});
		});
	});

	describe('Edge Cases', () => {
		describe('Graph has fewer vertices than edges', () => {
			it('Works does not add duplicate vetices', () => {
				graph.addEdge(new DirectedEdge(a, b), new UndirectedEdge(a, b), new UndirectedEdge(e, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [b, e]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(c), []);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), [a]);
			});

			it('List itself with self-loop in a directed graph', () => {
				graph.addEdge(new DirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), []);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), []);
			});

			it('List itself with self-loop in a undirected graph', () => {
				graph.addEdge(new UndirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), []);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), []);
			});

			it('List itself only once with two self-loop in a mixed graph', () => {
				graph.addEdge(new DirectedEdge(a, a), new UndirectedEdge(a, a));
				expectVerticesListsAreEqual(graph.getChildVertices(a), [a]);
				expectVerticesListsAreEqual(graph.getChildVertices(b), []);
				expectVerticesListsAreEqual(graph.getChildVertices(c), []);
				expectVerticesListsAreEqual(graph.getChildVertices(d), []);
				expectVerticesListsAreEqual(graph.getChildVertices(e), []);
			});
		});
	});
});
