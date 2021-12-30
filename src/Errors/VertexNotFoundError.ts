import { Vertex } from '../models/Vertex/Vertex/Vertex';

export class VertexNotFoundError extends Error {
	constructor(vertex: Vertex) {
		super(`Vertex ${JSON.stringify(vertex)} not found in graph.`);
	}
}
