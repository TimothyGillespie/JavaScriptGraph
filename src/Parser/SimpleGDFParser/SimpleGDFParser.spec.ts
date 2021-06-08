import SimpleGDFParser from './SimpleGDFParser';
import petersonGraph from '../../assets/FamousGraphs/PetersonGraph.gdf';
import Graph from '../../models/Graph/Graph';
import NamedVertex from '../../models/Vertex/NamedVertex/NamedVertex';
import expectVerticesListsAreEqual from '../../../testUtil/expectVerticesListsAreEqual';
import Edge from '../../models/Edge/Edge/Edge';
import DirectedEdge from '../../models/Edge/DirectedEdge/DirectedEdge';
import expectEdgeListsAreEqual from '../../../testUtil/expectEdgeListsAreEqual';

let g: Graph<any, any>;

describe('SimpleGDFParser', () => {
	it('Loads peterson graph', () => {
		new SimpleGDFParser().parse(petersonGraph);
		expect(true).toEqual(true);
	});

	it('List of vertices are as expected', () => {
		g = new SimpleGDFParser().parse(petersonGraph);

		expectVerticesListsAreEqual(
			g.getListOfVertices(),
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map((symbol) => new NamedVertex(symbol)),
		);
	});

	it('List of edges are as expected', () => {
		g = new SimpleGDFParser().parse(petersonGraph);

		const edgePairs: string[][] = [
			['a', 'b'],
			['b', 'c'],
			['c', 'd'],
			['d', 'e'],
			['e', 'a'],
			['a', 'f'],
			['b', 'g'],
			['c', 'h'],
			['d', 'i'],
			['e', 'j'],
			['f', 'h'],
			['h', 'j'],
			['j', 'g'],
			['g', 'i'],
			['i', 'f'],
		];

		const listOfEdges = edgePairs.map(
			([vertexA, vertexB]) => new DirectedEdge(new NamedVertex(vertexA), new NamedVertex(vertexB)),
		);
		expectEdgeListsAreEqual(g.getListOfEdges(), listOfEdges);
	});
});
