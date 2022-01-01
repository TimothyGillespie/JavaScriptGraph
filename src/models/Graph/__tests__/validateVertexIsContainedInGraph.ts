import { Graph } from '../Graph';
import { generateNamedVertices } from '../../../../testUtil/generationFromSimplerDatastructure';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { VertexNotFoundError } from '../../../Errors';

describe('graph.validateVertexIsContainedInGraph(v)', () => {
	describe('Normal Cases', () => {
		it('finds contained vertex', () => {
			const graph = new Graph(false);
			graph.addVertex(...generateNamedVertices(['a', 'b']));
			expect(() => graph.validateVertexIsContainedInGraph(new NamedVertex('a'))).not.toThrow();
		});
	});

	describe('Error Cases', () => {
		const graph = new Graph(false);
		graph.addVertex(...generateNamedVertices(['a', 'b']));
		expect(() => graph.validateVertexIsContainedInGraph(new NamedVertex('c'))).toThrow(VertexNotFoundError);
	});
});
