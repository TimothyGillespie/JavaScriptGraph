import Vertex from '../models/Vertex/Vertex/Vertex';

class VertexNotFoundError extends Error {
	constructor(vertex: Vertex) {
		super(`Vertex ${JSON.stringify(vertex)} not found in graph.`);
	}
}

export default VertexNotFoundError;
