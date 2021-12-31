import { Vertex } from '../Vertex/Vertex/Vertex';
import { Matrix } from './Matrix';
import { Edge } from '../Edge';

export class AdjacencyMatrix<V extends Vertex> extends Matrix<V, V, boolean> {
	constructor() {
		super(false);
	}

	static fromEdgeList<EV extends Vertex, E extends Edge<EV>>(edgeList: E[]): AdjacencyMatrix<EV> {
		const matrix: AdjacencyMatrix<EV> = new AdjacencyMatrix();

		edgeList.forEach((edge) => {
			matrix.set(edge.vertexA, edge.vertexB, true);
			if (!edge.isDirected()) {
				matrix.set(edge.vertexB, edge.vertexA, true);
			}
		});

		return matrix;
	}

    deleteVertex(vertex: V) {
        this.deleteRow(vertex);
        this.deleteColumn(vertex);
    }
}
