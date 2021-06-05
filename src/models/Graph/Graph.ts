import Vertex, { vertexEqual } from '../Vertex/Vertex/Vertex';
import Edge, { edgeEqual } from '../Edge/Edge/Edge';
import * as _ from 'lodash';
import AdjacencyMatrix from '../Matrix/AdjacencyMatrix';
import VertexNotFoundError from '../../Errors/VertexNotFoundError';
import AdjacencyList from '../AdjacencyList/AdjacencyList';

class Graph<V extends Vertex, E extends Edge<V>> {
	// Redundant information storage for performance
	protected _listOfEdges: E[];
	protected _listOfVertices: V[];

	protected _adjacencyMatrix: AdjacencyMatrix<V>;

	protected _adjacencyList: AdjacencyList<V>;

	protected _addUnknownVerticesInEdges: boolean;

	constructor(addUnknownVerticesInEdges: boolean = false) {
		this._listOfEdges = [];
		this._listOfVertices = [];
		this._adjacencyMatrix = new AdjacencyMatrix<V>();
		this._adjacencyList = new AdjacencyList<V>();

		this._addUnknownVerticesInEdges = addUnknownVerticesInEdges;
	}

	addVertex(...vertex: V[]): Graph<V, E> {
		const uniqueVertices = _.uniqWith(vertex, vertexEqual);
		const filteredVertices = _.differenceWith(uniqueVertices, this._listOfVertices, vertexEqual);
		filteredVertices.forEach((singleVertex) => {
			this._listOfVertices.push(singleVertex);
			this._adjacencyList.initVertex(singleVertex);
		});

		return this;
	}

	addEdge(...edge: E[]): Graph<V, E> {
		const uniqueEdges = _.uniqWith(edge, edgeEqual);
		const filteredEdges = _.differenceWith(uniqueEdges, this._listOfEdges, edgeEqual);

		if (!this.addsUnknownVerticesInEdges())
			filteredEdges.forEach((singleEdge) => this.validateEdgeVerticesAreContainedInGraph(singleEdge));
		else filteredEdges.forEach((singleEdge) => this.addVertex(singleEdge.vertexA, singleEdge.vertexB));

		filteredEdges.forEach((singleEdge) => {
			this._listOfEdges.push(singleEdge);

			this._adjacencyMatrix.set(singleEdge.vertexA, singleEdge.vertexB, true);
			this._adjacencyList.addAdjacency(singleEdge.vertexA, singleEdge.vertexB);

			if (!singleEdge.isDirected()) {
				this._adjacencyMatrix.set(singleEdge.vertexB, singleEdge.vertexA, true);
			}
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

	getAdjacencyList(): AdjacencyList<V> {
		return _.cloneDeep(this._adjacencyList);
	}

	addsUnknownVerticesInEdges(): boolean {
		return this._addUnknownVerticesInEdges;
	}

	validateEdgeVerticesAreContainedInGraph(edge: E) {
		this.validateVertexIsContainedInGraph(edge.vertexA);
		this.validateVertexIsContainedInGraph(edge.vertexB);
	}

	validateVertexIsContainedInGraph(vertex: V) {
		if (!this.isVertexContainedInGraph(vertex)) throw new VertexNotFoundError(vertex);
	}

	isVertexContainedInGraph(vertex: V): boolean {
		return this._listOfVertices.find((singleVertex) => singleVertex.equals(vertex)) !== undefined;
	}
}

export default Graph;
