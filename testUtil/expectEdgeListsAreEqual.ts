import {Vertex} from '../src/models/Vertex/Vertex/Vertex';
import {Edge} from '../src/models/Edge/Edge/Edge';
import { edgeCompareTo } from '../src/models/Edge/Edge/Edge';

export const expectEdgeListsAreEqual = (actual: Edge<Vertex>[], expected: Edge<Vertex>[]) => {
	actual.sort(edgeCompareTo);
	expected.sort(edgeCompareTo);
	expect(actual).toEqual(expected);
}
