import {Vertex, vertexCompareTo } from '../src/models/Vertex/Vertex/Vertex';

export function expectVerticesListsAreEqual(actual: Vertex[], expected: Vertex[]) {
	actual.sort(vertexCompareTo);
	expected.sort(vertexCompareTo);
	expect(actual).toEqual(expected);
}
