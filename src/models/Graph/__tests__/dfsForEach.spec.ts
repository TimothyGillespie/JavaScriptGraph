import Graph from '../Graph';
import NamedVertex from '../../Vertex/NamedVertex/NamedVertex';
import Edge from '../../Edge/Edge/Edge';

let graph: Graph<NamedVertex, Edge<NamedVertex>>;

let a: NamedVertex;
let b: NamedVertex;
let c: NamedVertex;
let d: NamedVertex;
let e: NamedVertex;

describe('g.dfsForEach(cb, v, f)', () => {
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
		it('Can use and alter the payload', () => {
			let expectedCounter = 1;

			graph.dfsForEach(({ payload }) => {
				const currentNumber = payload.counter ?? 0;
				payload.counter = currentNumber + 1;
				expect(expectedCounter).toEqual(payload.counter);
				expectedCounter++;
			});
		});
	});
});
