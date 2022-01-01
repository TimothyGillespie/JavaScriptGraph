import { Vertex, vertexCompareTo, vertexEqual } from '../Vertex/Vertex/Vertex';
import { Edge, edgeEqual } from '../Edge';
import * as cloneDeep from 'lodash.clonedeep';
import { AdjacencyMatrix } from '../Matrix/AdjacencyMatrix';
import { VertexNotFoundError } from '../../Errors';
import { AdjacencyList } from '../AdjacencyList/AdjacencyList';
import { TarjanStronglyConnectedComponentsAlgorithm } from './algorithms';
import { MutableHashMap } from '@tgillespie/hash-data-structures';
import { MutableHashSet } from '@tgillespie/hash-data-structures/lib/lib/mutable-hash-set/mutable-hash-set';

export class Graph<V extends Vertex, E extends Edge<V>> {
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
		const uniqueVertices = new MutableHashSet<V>();
		const setOfGraphVertices = new MutableHashSet<V>();

		vertex.forEach((x) => uniqueVertices.add(x));
		this._listOfVertices.forEach((x) => setOfGraphVertices.add(x));

		const filteredVertices = uniqueVertices.difference(setOfGraphVertices).toArray();

		filteredVertices.forEach((singleVertex) => {
			this._listOfVertices.push(singleVertex);
			this._adjacencyList.initVertex(singleVertex);
		});

		return this;
	}

	deleteVertex(...vertex: V[]): Graph<V, E> {
		const uniqueVertices = new MutableHashSet<V>();
		const setOfGraphVertices = new MutableHashSet<V>();

		vertex.forEach((x) => uniqueVertices.add(x));
		this._listOfVertices.forEach((x) => setOfGraphVertices.add(x));

		const filteredVertices = uniqueVertices.intersection(setOfGraphVertices).toArray();
		filteredVertices.forEach((singleVertex) => {
			this._listOfVertices = this._listOfVertices.filter((x) => !x.equals(singleVertex));
			this._listOfEdges = this._listOfEdges.filter(
				(x) => !x.vertexA.equals(singleVertex) && !x.vertexB.equals(singleVertex),
			);

			this._adjacencyMatrix.deleteVertex(singleVertex);

			this._adjacencyList.deleteVertex(singleVertex);
		});

		return this;
	}

	addEdge(...edge: E[]): Graph<V, E> {
		const uniqueEdges = new MutableHashSet<E>();
		const setOfGraphEdges = new MutableHashSet<E>();

		edge.forEach((x) => uniqueEdges.add(x));
		this._listOfEdges.forEach((x) => setOfGraphEdges.add(x));

		const filteredEdges = uniqueEdges.difference(setOfGraphEdges).toArray();

		if (!this.addUnknownVerticesInEdges)
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

	deleteEdge(...edge: E[]): Graph<V, E> {
		const uniqueEdges = new MutableHashSet<E>();
		const setOfGraphEdges = new MutableHashSet<E>();

		edge.forEach((x) => uniqueEdges.add(x));
		this._listOfEdges.forEach((x) => setOfGraphEdges.add(x));

		const filteredEdges = uniqueEdges.intersection(setOfGraphEdges).toArray();
		filteredEdges.forEach((singleEdge) => {
			this._listOfEdges = this._listOfEdges.filter((x) => !x.equals(singleEdge));

			this._adjacencyMatrix.set(singleEdge.vertexA, singleEdge.vertexB, false);
			if (!singleEdge.isDirected()) {
				this._adjacencyMatrix.set(singleEdge.vertexB, singleEdge.vertexA, false);
			}
			this._adjacencyList.deleteEdge(singleEdge);
		});

		return this;
	}

	getAdjacentVerticesFor(vertex: V): V[] {
		return this.getAdjacencyList().getAdjacentVertices(vertex);
	}

	getChildVertices(vertex: V): V[] {
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

		const resultSet = new MutableHashSet<V>();
		result.forEach((x) => resultSet.add(x));

		return resultSet.toArray();
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

	transpose() {
		this._listOfEdges.forEach((singleEdge) => {
			singleEdge.transpose();
		});

		this._adjacencyMatrix = AdjacencyMatrix.fromEdgeList(this.getListOfEdges());
	}

	dfsForEach<T>(
		cb: (info: GraphIterationCallbackParameter<V, E, this, T>) => void,
		initialPayload: T,
		startVertex?: V,
		orderFunction: (a: V, b: V, more?: GraphIterationCallbackParameter<V, E, this, T>) => number = vertexCompareTo,
	) {
		const payload: T = initialPayload;
		for (const dfsIteration of this.dfsIterator(startVertex, orderFunction)) cb({ ...dfsIteration, payload });
	}

	*dfsIterator(
		startVertex?: V,
		orderFunction: (
			a: V,
			b: V,
			more?: GraphIterationCallbackParameter<V, E, this, any>,
		) => number = vertexCompareTo,
	): Generator<Omit<GraphIterationCallbackParameter<V, E, this, any>, 'payload'>, void, unknown> {
		const visited: MutableHashMap<V, boolean> = new MutableHashMap();
		for (const singleVertexInGraph of this.getListOfVertices()) visited.set(singleVertexInGraph, false);
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

			while (![...visited.values()].every((x) => x)) {
				currentVertex = stack.pop();
				if (currentVertex === undefined) {
					takenEdge = null;
					previousVertex = null;
					for (const maybeUnvisited of this.getListOfVertices())
						if (!visited.get(maybeUnvisited)) {
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

				if (!visited.get(currentVertex)) {
					visited.set(currentVertex, true);
					const adjacentVertices = this.getChildVertices(currentVertex);
					adjacentVertices.sort(orderFunction);
					adjacentVertices.reverse();

					yield { currentVertex, previousVertex, visited, takenEdge, graph: this };

					previousVertex = currentVertex;
					stack.push(...adjacentVertices);
				}
			}
		}
	}

	getSubgraph(vertices: V[]): Graph<V, E> {
		vertices.forEach((singleVertex) => this.validateVertexIsContainedInGraph(singleVertex));

		const subgraph = new Graph<V, E>();
		subgraph.addVertex(...vertices);

		this.getListOfEdges().forEach((singleEdge) => {
			if (
				subgraph.isVertexContainedInGraph(singleEdge.vertexA) &&
				subgraph.isVertexContainedInGraph(singleEdge.vertexB)
			)
				subgraph.addEdge(singleEdge);
		});

		return subgraph;
	}

	getStronglyConnectedComponents(): V[][] {
		return TarjanStronglyConnectedComponentsAlgorithm.getStronglyConnectedComponentFor(this);
	}

	copy(): this {
		return cloneDeep(this);
	}

	getListOfEdges(): E[] {
		return cloneDeep(this._listOfEdges);
	}

	getListOfVertices(): V[] {
		return cloneDeep(this._listOfVertices);
	}

	getAdjacencyMatrix(): AdjacencyMatrix<V> {
		return cloneDeep(this._adjacencyMatrix);
	}

	getAdjacencyList(): AdjacencyList<V> {
		return cloneDeep(this._adjacencyList);
	}

	get addUnknownVerticesInEdges(): boolean {
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

export interface GraphIterationCallbackParameter<V extends Vertex, E extends Edge<V>, G extends Graph<V, E>, T> {
	graph: Readonly<G>;
	currentVertex: Readonly<V>;
	previousVertex: Readonly<V | null>;
	visited: Readonly<MutableHashMap<V, boolean>>;
	takenEdge: Readonly<E | null>;
	payload: T;
}
