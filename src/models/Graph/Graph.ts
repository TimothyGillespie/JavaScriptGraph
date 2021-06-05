import Vertex, { vertexEqual } from '../Vertex/Vertex/Vertex';
import Edge from '../Edge/Edge/Edge';
import * as _ from 'lodash';
import AdjacencyMatrix from '../Matrix/AdjacencyMatrix';

class Graph<V extends Vertex, E extends Edge<V>> {
	// Redundant information storage for performance
	protected _listOfEdges: E[];
	protected _listOfVertices: V[];

	protected _adjacencyMatrix: AdjacencyMatrix<V>;

	protected _adjacencyList: Map<V, V[]>;

	constructor() {
		this._listOfEdges = [];
		this._listOfVertices = [];
		this._adjacencyMatrix = new AdjacencyMatrix<V>();
		this._adjacencyList = new Map();
	}

	addVertex(...vertex: V[]): Graph<V, E> {
		const filteredVertices = _.differenceWith(vertex, this._listOfVertices, vertexEqual);
		filteredVertices.forEach((singleVertex) => {
			this._listOfVertices.push(singleVertex);
			this._adjacencyList.set(singleVertex, []);
		});

		return this;
	}

	getListOfEdges(): E[] {
		return _.cloneDeep(this._listOfEdges);
	}

	getListOfVertices(): V[] {
		return _.cloneDeep(this._listOfVertices);
	}

	getAdjacencyMatrix(): AdjacencyMatrix<V> {
		return _.cloneDeep(this._adjacencyMatrix);
	}

	getAdjacencyList(): Map<V, V[]> {
		return _.cloneDeep(this._adjacencyList);
	}
}

export default Graph;
