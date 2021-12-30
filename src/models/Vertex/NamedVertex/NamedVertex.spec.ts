import { NamedVertex } from './NamedVertex';
import { ContractVerifier } from '@tgillespie/hash-data-structures';

it('NamedVertex keeps Hashable Contract', () => {
	const examples = [
		new NamedVertex('nutiae'),
		new NamedVertex('ogugl'),
		new NamedVertex('A'),
		new NamedVertex('a'),
		new NamedVertex('b'),
		new NamedVertex('c'),
		new NamedVertex('enfulge'),
		new NamedVertex('vlfgnu'),
		new NamedVertex('fgvxlc'),
		new NamedVertex('mäuprtd' + 'auritdn/{}'),
		new NamedVertex('{'),
		new NamedVertex('}' + '{})(-::'),
	];

	expect(() => new ContractVerifier(examples).verifyContract()).not.toThrow();
});
