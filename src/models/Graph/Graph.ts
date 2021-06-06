import Vertex, { vertexCompareTo, vertexEqual } from '../Vertex/Vertex/Vertex';
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

	getAdjacentVerticesFor(vertex: V): V[] {
		return this.getAdjacencyList().getAdjacentVertices(vertex);
	}

	getChildNodes(vertex: V): V[] {
		const allEdges = this.getListOfEdges();
		const allVertices = this.getListOfVertices();
		let result: V[] = [];

		// ToDo: Possible optimization: just return adjacency list for the node if graph is undirected (keep track with a property)

		if (allEdges.length >= allVertices.length) {
			const adjacencyMatrix = this.getAdjacencyMatrix();
			result = allVertices.filter((maybeChild) => {
				return adjacencyMatrix.get(vertex, maybeChild);
			});
		} else {
			allEdges.forEach((singleEdge) => {
				if (singleEdge.vertexA.equals(vertex)) result.push(singleEdge.vertexB);

				if (!singleEdge.isDirected() && singleEdge.vertexB.equals(vertex)) result.push(singleEdge.vertexA);
			});
		}

		return _.uniqWith(result, vertexEqual);
	}

	getEdges(vertexA: V, vertexB: V): E[] {
		return this.getListOfEdges().filter(
			(maybeWantedEdge) =>
				(maybeWantedEdge.vertexA.equals(vertexA) && maybeWantedEdge.vertexB.equals(vertexB)) ||
				(maybeWantedEdge.isDirected() &&
					maybeWantedEdge.vertexA.equals(vertexB) &&
					maybeWantedEdge.vertexB.equals(vertexA)),
		);
	}

	dfsForEach<T>(
		cb: (info: graphIterationCallbackParameter<V, E, this, T>) => void,
		initialPayload: T,
		startVertex: Vertex | undefined = undefined,
		orderFunction: (a: V, b: V, more?: graphIterationCallbackParameter<V, E, this, T>) => number = vertexCompareTo,
	) {
		const payload: T = initialPayload;
		for (const dfsIteration of this.dfsIterator()) cb({ ...dfsIteration, payload });
	}

	*dfsIterator(
		startVertex: V | undefined = undefined,
		orderFunction: (
			a: V,
			b: V,
			more?: graphIterationCallbackParameter<V, E, this, any>,
		) => number = vertexCompareTo,
	): Generator<Omit<graphIterationCallbackParameter<V, E, this, any>, 'payload'>, void, unknown> {
		// ToDo: replace with own map too
		const visited: Map<string, boolean> = new Map();
		for (const singleVertexInGraph of this.getListOfVertices())
			visited.set(JSON.stringify(singleVertexInGraph), false);
		let currentVertex: V | undefined;

		if (startVertex === undefined) {
			const listOfNodes = this.getListOfVertices();
			if (listOfNodes.length === 0) currentVertex = undefined;
			else {
				listOfNodes.sort(orderFunction);
				currentVertex = listOfNodes[0];
			}
		} else {
			currentVertex = startVertex;
		}

		const stack: V[] = [];

		if (currentVertex !== undefined) {
			stack.push(currentVertex);

			let takenEdge = null;
			let previousVertex = null;

			while (![...visited.values()].every(_.identity)) {
				currentVertex = stack.pop();
				if (currentVertex === undefined) {
					takenEdge = null;
					previousVertex = null;
					for (const maybeUnvisited of this.getListOfVertices())
						if (!visited.get(JSON.stringify(maybeUnvisited))) {
							currentVertex = maybeUnvisited;
							break;
						}
				} else {
					if (previousVertex !== null) {
						const possibleEdges = this.getEdges(previousVertex, currentVertex);
						if (possibleEdges.length === 0) takenEdge = null;
						else takenEdge = possibleEdges[0];
					} else {
						takenEdge = null;
					}
				}

				if (currentVertex === undefined) break;

				if (!visited.get(JSON.stringify(currentVertex))) {
					visited.set(JSON.stringify(currentVertex), true);
					const adjacentVertices = this.getChildNodes(currentVertex);
					adjacentVertices.sort(orderFunction);
					adjacentVertices.reverse();

					yield { currentVertex, previousVertex, visited, takenEdge, graph: this };

					previousVertex = currentVertex;
					stack.push(...adjacentVertices);
				}
			}
		}
	}

	copy(): this {
		return _.cloneDeep(this);
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

export interface graphIterationCallbackParameter<V extends Vertex, E extends Edge<V>, G extends Graph<V, E>, T> {
	graph: Readonly<G>;
	currentVertex: Readonly<V>;
	previousVertex: Readonly<V | null>;
	// ToDo: replace with own map too
	visited: Readonly<Map<string, boolean>>;
	takenEdge: Readonly<E | null>;
	payload: T;
}

export default Graph;
