import {NamedVertex} from '../../Vertex/NamedVertex/NamedVertex';
import {DirectedEdge} from '../../Edge/DirectedEdge/DirectedEdge';
import {Graph} from '../Graph';
import {
	generateDirectedEdgesWithNameVertex,
	generateNamedVertices,
	generateUndirectedEdgesWithNameVertex,
} from '../../../../testUtil/generationFromSimplerDatastructure';

let g: Graph<any, any>;

// Testing order sensitively for ease - ToDo: introduce test utility
describe('g.getStronglyConnectedComponent()', () => {
	beforeEach(() => {
		g = new Graph<NamedVertex, DirectedEdge<NamedVertex>>(true);
	});

	describe('Normal Cases', () => {
		it('Works with directed edges', () => {
			const edges = generateDirectedEdgesWithNameVertex([
				['a', 'b'],
				['b', 'c'],
				['c', 'a'],
				['d', 'a'],
				['e', 'd'],
			]);

			g.addEdge(...edges);

			expect(g.getStronglyConnectedComponents()).toEqual([
				generateNamedVertices(['c', 'b', 'a']),
				generateNamedVertices(['d']),
				generateNamedVertices(['e']),
			]);
		});

		it('Works with undirected edges', () => {
			g = new Graph<NamedVertex, DirectedEdge<NamedVertex>>(true);

			const edges = generateUndirectedEdgesWithNameVertex([
				['a', 'b'],
				['b', 'd'],
				['c', 'e'],
				['f', 'e'],
			]);

			g.addEdge(...edges);

			expect(g.getStronglyConnectedComponents()).toEqual([
				generateNamedVertices(['d', 'b', 'a']),
				generateNamedVertices(['f', 'e', 'c']),
			]);
		});
	});
});
