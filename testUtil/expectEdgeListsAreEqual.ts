import * as _ from 'lodash';
import Vertex, { vertexCompareTo } from '../src/models/Vertex/Vertex/Vertex';
import Edge from '../src/models/Edge/Edge/Edge';
import { edgeCompareTo } from '../src/models/Edge/Edge/Edge';

function expectEdgeListsAreEqual(actual: Edge<Vertex>[], expected: Edge<Vertex>[]) {
	actual.sort(edgeCompareTo);
	expected.sort(edgeCompareTo);
	expect(actual).toEqual(expected);
}

export default expectEdgeListsAreEqual;
