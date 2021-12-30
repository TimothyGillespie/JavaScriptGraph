import { Graph } from '../Graph';
import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { Edge } from '../../Edge/Edge/Edge';
import SimpleGDFParser from '../../../Parser/SimpleGDFParser/SimpleGDFParser';
import { petersonGraph } from '../../../assets/FamousGraphs/PetersonGraph.gdf';
import {
	generateDirectedEdgesWithNameVertex,
	generateNamedVertices,
} from '../../../../testUtil/generationFromSimplerDatastructure';
import { expectVerticesListsAreEqual } from '../../../../testUtil/expectVerticesListsAreEqual';

let completeGraph: Graph<NamedVertex, Edge<NamedVertex>>;
let subgraph: Graph<NamedVertex, Edge<NamedVertex>>;

const verticesSubset = generateNamedVertices(['a', 'b', 'd', 'e', 'i', 'j']);

describe('g.getSubgraph(vs)', () => {
	beforeEach(() => {
		completeGraph = new SimpleGDFParser().parse(petersonGraph);
		subgraph = completeGraph.getSubgraph(verticesSubset);
	});

	describe('Normal Cases', () => {
		it('All passed vertices are contained', () => {
			expectVerticesListsAreEqual(subgraph.getListOfVertices(), verticesSubset);
		});

		it('Edges which had both vertices passed are contained', () => {
			const expectedEdges = generateDirectedEdgesWithNameVertex([
				['a', 'b'],
				['b', 'c'],
				['d', 'e'],
				['d', 'i'],
				['e', 'j'],
			]);
		});
	});
});
