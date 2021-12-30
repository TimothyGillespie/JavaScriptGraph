import UndirectedEdge from "./UndirectedEdge";
import NamedVertex from "../../Vertex/NamedVertex/NamedVertex";
import {ContractVerifier} from "@tgillespie/hash-data-structures";

describe('UndirectedEdge', () => {
    it('keeps Hashable Contract', () => {
        const examples = [
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b')),
            new UndirectedEdge(new NamedVertex('b'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex(' a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a '), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex(' a '), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('a '), new NamedVertex('a ')),
            new UndirectedEdge(new NamedVertex('b'), new NamedVertex('b')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('a')),
            new UndirectedEdge(new NamedVertex('{'), new NamedVertex('}')),
            new UndirectedEdge(new NamedVertex('}'), new NamedVertex('{')),
            new UndirectedEdge(new NamedVertex('longer'), new NamedVertex('name')),
            new UndirectedEdge(new NamedVertex('glfuenegufelg'), new NamedVertex('unafgelgfengfunlegf')),
            new UndirectedEdge(new NamedVertex(''), new NamedVertex('')),
            new UndirectedEdge(new NamedVertex('a'), new NamedVertex('')),
            new UndirectedEdge(new NamedVertex(''), new NamedVertex('nfgeuved')),
        ];

        expect(() => new ContractVerifier(examples).verifyContract()).not.toThrow();
    });

    it('states that it is undirected', () => {
        const someEdge = new UndirectedEdge(new NamedVertex('a'), new NamedVertex('b'));
        expect(someEdge.isDirected()).toBe(false);
    })
});
