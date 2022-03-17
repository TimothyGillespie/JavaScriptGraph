import { Vertex, vertexCompareTo } from '../Vertex/Vertex/Vertex';
import { Edge } from '../Edge';
// @ts-ignore
import * as cloneDeep from 'lodash.clonedeep';
import { AdjacencyMatrix } from '../Matrix/AdjacencyMatrix';
import { VertexNotFoundError } from '../../Errors';
import { AdjacencyList } from '../AdjacencyList/AdjacencyList';
import { TarjanStronglyConnectedComponentsAlgorithm } from './algorithms';
import { MutableHashMap } from '@tgillespie/hash-data-structures';
import { MutableHashSet } from '@tgillespie/hash-data-structures/lib/lib/mutable-hash-set/mutable-hash-set';

/**
 * The Graph class serves as a container for the different components and algorithms on the graph.
 * It models itself redundantly to provide the best suitable and efficient data structure for various algorithms and the
 * end user who can fetch the deep clone of the underlying data structures.
 */
export class Graph<V extends Vertex, E extends Edge<V>> {
    // Redundant information storage for performance
    protected _listOfEdges: E[];
    protected _listOfVertices: V[];

    protected _adjacencyMatrix: AdjacencyMatrix<V>;

    protected _adjacencyList: AdjacencyList<V>;

    protected _addUnknownVerticesInEdges: boolean;

    /**
     * Creates an empty Graph object.
     *
     * @param addUnknownVerticesInEdges Whether vertices contained in an added Edge should be automatically added to the list
     * of vertices. If true it will add unknown vertices. If false it will throw an VertexNotFoundError when trying to add edges with unknown
     * vertices.
     */
    constructor(addUnknownVerticesInEdges: boolean = false) {
        this._listOfEdges = [];
        this._listOfVertices = [];
        this._adjacencyMatrix = new AdjacencyMatrix<V>();
        this._adjacencyList = new AdjacencyList<V>();

        this._addUnknownVerticesInEdges = addUnknownVerticesInEdges;
    }

    /**
     * Attempt to add one or many vertices. Vertices which are already contained in the Graph (determined by their .equals() method)
     * are not ignored.
     *
     * @param vertex The vertex / vertices to be added. Duplicates are only processed once.
     */
    addVertex(...vertex: V[]): Graph<V, E> {
        const uniqueVertices = new MutableHashSet<V>();
        const setOfGraphVertices = new MutableHashSet<V>();

        vertex.forEach((x) => uniqueVertices.add(x));
        this._listOfVertices.forEach((x) => setOfGraphVertices.add(x));

        const filteredVertices = uniqueVertices.difference(setOfGraphVertices).toArray();

        filteredVertices.forEach((singleVertex) => {
            this._listOfVertices.push(singleVertex);
        });

        return this;
    }

    /**
     * Attempt to remove one or many vertices from the graph. Vertices which are not contained in the Graph (determined by their .equals() method)
     * are not ignored. Edges containing the vertex are also removed.
     *
     * @param vertex The vertex / vertices to be removed. Duplicates are only processed once.
     */
    deleteVertex(...vertex: V[]): Graph<V, E> {
        const uniqueVertices = new MutableHashSet<V>();
        const setOfGraphVertices = new MutableHashSet<V>();

        vertex.forEach((x) => uniqueVertices.add(x));
        this._listOfVertices.forEach((x) => setOfGraphVertices.add(x));

        const filteredVertices = uniqueVertices.intersection(setOfGraphVertices).toArray();
        filteredVertices.forEach((singleVertex) => {
            this._listOfVertices = this._listOfVertices.filter((x) => !x.equals(singleVertex));
            this._listOfEdges = this._listOfEdges.filter(
                (x) => !x.vertexA.equals(singleVertex) && !x.vertexB.equals(singleVertex)
            );

            this._adjacencyMatrix.deleteVertex(singleVertex);

            this._adjacencyList.deleteVertex(singleVertex);
        });

        return this;
    }

    /**
     * Attempt to add one or many edges. Edges which are already contained in the Graph (determined by their .equals() method)
     * are not ignored.
     *
     * @param edge The edge / edges to be added. Duplicates are only processed once.
     *
     * @throws VertexNotFoundError if addUnknownVerticesInEdges is set to true and any edges contains a vertex not contained
     * in the Graph. If this error is thrown none of the passed edges is added.
     */
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

    /**
     * Attempt to remove one or many edges. Edges which are not contained in the Graph (determined by their .equals() method)
     * are not ignored.
     *
     * @param edge The edge / edges to be removed. Duplicates are only processed once.
     */
    deleteEdge(...edge: E[]): Graph<V, E> {
        const uniqueEdges = new MutableHashSet<E>();
        const setOfGraphEdges = new MutableHashSet<E>();

        edge.forEach((x) => uniqueEdges.add(x));
        this._listOfEdges.forEach((x) => setOfGraphEdges.add(x));

        const filteredEdges = uniqueEdges.intersection(setOfGraphEdges).toArray();
        filteredEdges.forEach((singleEdge) => {
            this._listOfEdges = this._listOfEdges.filter((x) => !x.equals(singleEdge));

            const givenDirectionExists = this.getEdges(singleEdge.vertexA, singleEdge.vertexB).length > 0;
            const inverseDirectionExists = this.getEdges(singleEdge.vertexB, singleEdge.vertexA).length > 0;
            // Only remove from adjacency matrix if no such edge connection (considering direction) exists
            if (!givenDirectionExists) {
                this._adjacencyMatrix.set(singleEdge.vertexA, singleEdge.vertexB, false);
            }

            if (!inverseDirectionExists) {
                this._adjacencyMatrix.set(singleEdge.vertexB, singleEdge.vertexA, false);
            }

            if (!givenDirectionExists && !inverseDirectionExists) {
                this._adjacencyList.deleteEdge(singleEdge);
            }
        });

        return this;
    }

    /**
     * Retrieves all vertices which are adjacent (either parent or child) of a given vertex.
     *
     * @param vertex The vertex which adjacent vertices should be found.
     */
    getAdjacentVerticesFor(vertex: V): V[] {
        return this.getAdjacencyList().getAdjacentVertices(vertex);
    }

    /**
     * Retrieves all child vertices of a given vertex. Vertices attached via an undirected edges are always included.
     *
     * @param vertex The vertex which child vertices should be found.
     */
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

    /**
     * Retrieves all edges attached to a vertex regardless of type and direction. Loop edges are also included.
     *
     * @param vertex The vertex which attached edges should be found.
     */
    getAttachedEdges(vertex: V): E[] {
        return this.getListOfEdges().filter(({ vertexA, vertexB }) => {
            return vertexA.equals(vertex) || vertexB.equals(vertex);
        });
    }

    /**
     * Retrieves all outgoing vertices of a given vertex. If the edge is directed then this is the case when it is vertexA (source).
     * Undirected edges are always included. Loop edges are also included.
     *
     * @param vertex The vertex which attached edges should be found.
     */
    getOutgoingEdges(vertex: V): E[] {
        return this.getListOfEdges().filter(({ vertexA, vertexB, isDirected }) => {
            if (isDirected()) {
                return vertexA.equals(vertex);
            }

            return vertexA.equals(vertex) || vertexB.equals(vertex);
        });
    }

    /**
     * Retrieves all incoming vertices of a given vertex. If the edge is directed then this is the case when it is vertexB (target).
     * Undirected edges are always included. Loop edges are also included.
     *
     * @param vertex The vertex which attached edges should be found.
     */
    getIncomingEdges(vertex: V): E[] {
        return this.getListOfEdges().filter(({ vertexA, vertexB, isDirected }) => {
            if (isDirected()) {
                return vertexB.equals(vertex);
            }

            return vertexA.equals(vertex) || vertexB.equals(vertex);
        });
    }

	/**
	 * Retrieves edges in the graph with the given source and target vertex. Undirected edges disregard source and target check both orders.
	 *
	 * @param vertexA The source vertex.
	 * @param vertexB The target vertex.
	 */
	getEdges(vertexA: V, vertexB: V): E[] {
		return this.getListOfEdges().filter(
			(maybeWantedEdge) =>
				(maybeWantedEdge.vertexA.equals(vertexA) && maybeWantedEdge.vertexB.equals(vertexB)) ||
				(maybeWantedEdge.isDirected() &&
					maybeWantedEdge.vertexA.equals(vertexB) &&
					maybeWantedEdge.vertexB.equals(vertexA)),
		);
	}

    /**
     * Transposes all edges of the Graph by calling the transpose method on all edges. This inverts source and target vertex.
     * For directed edges this is supposed to inverse their direction. It should be without effect for undirected edges.
     *
     * References to the edges remain in-tact. The adjacency matrix is regenerated out-dating all references to the matrix.
     */
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
        orderFunction: (a: V, b: V, more?: GraphIterationCallbackParameter<V, E, this, T>) => number = vertexCompareTo
    ) {
        const payload: T = initialPayload;
        for (const dfsIteration of this.dfsIterator(startVertex, orderFunction)) cb({ ...dfsIteration, payload });
    }

    *dfsIterator(
        startVertex?: V,
        orderFunction: (a: V, b: V, more?: GraphIterationCallbackParameter<V, E, this, any>) => number = vertexCompareTo
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

    /**
     * Retrieves the subgraph which contains the given vertices. Edges missing a vertex as a result are not included.
     * Unlike other methods this one generates and returns an entirely new Graph and does not mutate the Graph it is called on.
     *
     * @param vertices The vertices to form the subgraph with.
     *
     * @throws VertexNotFoundError if at least on of the passed vertices is not actually contained in the Graph per its equals
     * method.
     */
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

    /**
     * Returns a deep clone of the Graph. Including edges and vertices.
     */
    copy(): this {
        return cloneDeep(this);
    }

    /**
     * Retrieves a deep clone of the list of edges used to represent this graph internally.
     */
    getListOfEdges(): E[] {
        return cloneDeep(this._listOfEdges);
    }

    /**
     * Retrieves a deep clone of the list of vertices used to represent this graph internally.
     */
    getListOfVertices(): V[] {
        return cloneDeep(this._listOfVertices);
    }

    /**
     * Retrieves a deep clone of the adjacency matrix used to represent this graph internally.
     */
    getAdjacencyMatrix(): AdjacencyMatrix<V> {
        return cloneDeep(this._adjacencyMatrix);
    }

    /**
     * Retrieves deep clone of the adjacency list used to represent this graph internally.
     */
    getAdjacencyList(): AdjacencyList<V> {
        return cloneDeep(this._adjacencyList);
    }

    /**
     * Whether vertices contained in an added Edge should be automatically added to the list of vertices.
     *
     * If true it will add unknown vertices.
     * If false it will throw an VertexNotFoundError when trying to add edges with unknown vertices.
     */
    get addUnknownVerticesInEdges(): boolean {
        return this._addUnknownVerticesInEdges;
    }

    /**
     * Validates that the vertices of an edge are contained in Graph. If not it will throw a VertexNotFoundError.
     *
     * @param edge The edges which vertices should be checked to be contained in the Graph.
     *
     * @throws VertexNotFoundError if any vertex of the edge does not exist in the Graph.
     */
    validateEdgeVerticesAreContainedInGraph(edge: E) {
        this.validateVertexIsContainedInGraph(edge.vertexA);
        this.validateVertexIsContainedInGraph(edge.vertexB);
    }

    /**
     * Validates that a given vertex is contained in Graph. If not it will throw a VertexNotFoundError.
     *
     * @param vertex The vertex which should be checked to be contained in the Graph.
     *
     * @throws VertexNotFoundError if the vertex does not exist in the Graph.
     */
    validateVertexIsContainedInGraph(vertex: V) {
        if (!this.isVertexContainedInGraph(vertex)) throw new VertexNotFoundError(vertex);
    }

    /**
     * Determines whether a given vertex is contained in Graph.
     *
     * true = is contained
     * false = is not contained
     *
     * @param vertex The vertex which should be checked to be contained in the Graph.
     */
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
