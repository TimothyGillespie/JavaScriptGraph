import {Vertex, vertexCompareTo } from '../src/models/Vertex/Vertex/Vertex';

export const expectVerticesListsAreEqual = (actual: Vertex[], expected: Vertex[]): void => {
	actual.sort(vertexCompareTo);
	expected.sort(vertexCompareTo);
	expect(actual).toEqual(expected);
}
