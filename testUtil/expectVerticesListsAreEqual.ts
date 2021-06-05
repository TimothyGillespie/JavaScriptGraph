import * as _ from 'lodash';
import Vertex, { vertexCompareTo } from '../src/models/Vertex/Vertex/Vertex';

function expectVerticesListsAreEqual(actual: Vertex[], expected: Vertex[]) {
	actual.sort(vertexCompareTo);
	expected.sort(vertexCompareTo);
	expect(actual).toEqual(expected);
}

export default expectVerticesListsAreEqual;
