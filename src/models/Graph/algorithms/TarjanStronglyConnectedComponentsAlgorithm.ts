import Graph from '../Graph';
import Vertex from '../../Vertex/Vertex/Vertex';

// ToDo: Replace maps with own map
class TarjanStronglyConnectedComponentsAlgorithm<V extends Vertex> {
	private constructor(graph: Graph<V, any>) {
		this.graph = graph;

		this.discreteTime = 0;
		this.stack = [];
		this.lowMap = new Map();
		this.discMap = new Map();

		this.result = [];
	}

	graph: Graph<V, any>;

	discreteTime: number;
	stack: V[];
	lowMap: Map<string, number>;
	discMap: Map<string, number>;

	result: V[][];

	static getStronglyConnectedComponentFor<V extends Vertex>(graph: Graph<V, any>): V[][] {
		const algo = new TarjanStronglyConnectedComponentsAlgorithm(graph);

		algo.graph.getListOfVertices().forEach((singleVertex) => {
			if (!algo.discMap.has(JSON.stringify(singleVertex))) algo.dfsUtil(singleVertex);
		});

		return algo.result;
	}

	private dfsUtil(currentVertex: V) {
		this.discMap.set(JSON.stringify(currentVertex), this.discreteTime);
		this.lowMap.set(JSON.stringify(currentVertex), this.discreteTime);
		this.discreteTime += 1;
		this.stack.push(currentVertex);
		this.graph.getChildVertices(currentVertex).forEach((childVertex) => {
			if (!this.discMap.has(JSON.stringify(childVertex))) {
				this.dfsUtil(childVertex);
				this.lowMap.set(
					JSON.stringify(currentVertex),
					Math.min(
						this.lowMap.get(JSON.stringify(currentVertex)) ?? -1,
						this.lowMap.get(JSON.stringify(childVertex)) ?? -1,
					),
				);
			} else if (this.stack.find((stackVertex) => stackVertex.equals(childVertex)) !== undefined) {
				this.lowMap.set(
					JSON.stringify(currentVertex),
					Math.min(
						this.lowMap.get(JSON.stringify(currentVertex)) ?? -1,
						this.discMap.get(JSON.stringify(childVertex)) ?? -1,
					),
				);
			}
		});

		if (this.lowMap.get(JSON.stringify(currentVertex)) === this.discMap.get(JSON.stringify(currentVertex))) {
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

export default TarjanStronglyConnectedComponentsAlgorithm;
