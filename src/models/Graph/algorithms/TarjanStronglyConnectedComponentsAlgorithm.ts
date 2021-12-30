import {Graph} from '../Graph';
import {Vertex} from '../../Vertex/Vertex/Vertex';
import {MutableHashMap} from "@tgillespie/hash-data-structures";

export class TarjanStronglyConnectedComponentsAlgorithm<V extends Vertex> {
	private constructor(graph: Graph<V, any>) {
		this.graph = graph;

		this.discreteTime = 0;
		this.stack = [];
		this.lowMap = new MutableHashMap();
		this.discMap = new MutableHashMap();

		this.result = [];
	}

	graph: Graph<V, any>;

	discreteTime: number;
	stack: V[];
	lowMap: MutableHashMap<V, number>;
	discMap: MutableHashMap<V, number>;

	result: V[][];

	static getStronglyConnectedComponentFor<V extends Vertex>(graph: Graph<V, any>): V[][] {
		const algo = new TarjanStronglyConnectedComponentsAlgorithm(graph);

		algo.graph.getListOfVertices().forEach((singleVertex) => {
			if (!algo.discMap.has(singleVertex)) algo.dfsUtil(singleVertex);
		});

		return algo.result;
	}

	private dfsUtil(currentVertex: V) {
		this.discMap.set(currentVertex, this.discreteTime);
		this.lowMap.set(currentVertex, this.discreteTime);
		this.discreteTime += 1;
		this.stack.push(currentVertex);
		this.graph.getChildVertices(currentVertex).forEach((childVertex) => {
			if (!this.discMap.has(childVertex)) {
				this.dfsUtil(childVertex);
				this.lowMap.set(
					currentVertex,
					Math.min(
						this.lowMap.get(currentVertex) ?? -1,
						this.lowMap.get(childVertex) ?? -1,
					),
				);
			} else if (this.stack.find((stackVertex) => stackVertex.equals(childVertex)) !== undefined) {
				this.lowMap.set(
					currentVertex,
					Math.min(
						this.lowMap.get(currentVertex) ?? -1,
						this.discMap.get(childVertex) ?? -1,
					),
				);
			}
		});

		if (this.lowMap.get(currentVertex) === this.discMap.get(currentVertex)) {
			const currentComponent: V[] = [];
			let otherVertex: V;
			do {
				otherVertex = this.stack.pop()!;
				currentComponent.push(otherVertex);
			} while (!currentVertex.equals(otherVertex));
			this.result.push(currentComponent);
		}
	}
}
