import { NamedVertex } from '../../Vertex/NamedVertex/NamedVertex';
import { DirectedEdge } from './DirectedEdge';
import { ContractVerifier } from '@tgillespie/hash-data-structures';

describe('DirectedEdge', () => {
	it('keeps Hashable Contract', () => {
		const examples = [
			new DirectedEdge(new NamedVertex('a'), new NamedVertex('b')),
			new DirectedEdge(new NamedVertex('b'), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex(' a'), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex('a '), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex(' a '), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex('a a'), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex('a '), new NamedVertex('a ')),
			new DirectedEdge(new NamedVertex('b'), new NamedVertex('b')),
			new DirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
			new DirectedEdge(new NamedVertex('{'), new NamedVertex('}')),
			new DirectedEdge(new NamedVertex('}'), new NamedVertex('{')),
			new DirectedEdge(new NamedVertex('longer'), new NamedVertex('name')),
			new DirectedEdge(new NamedVertex('glfuenegufelg'), new NamedVertex('unafgelgfengfunlegf')),
			new DirectedEdge(new NamedVertex(''), new NamedVertex('')),
			new DirectedEdge(new NamedVertex('a'), new NamedVertex('')),
			new DirectedEdge(new NamedVertex(''), new NamedVertex('nfgeuved')),
		];

		expect(() => new ContractVerifier(examples).verifyContract()).not.toThrow();
	});

	it('states that it is directed', () => {
		const someEdge = new DirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
		expect(someEdge.isDirected()).toBe(true);
	});
});
