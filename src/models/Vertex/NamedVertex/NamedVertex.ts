import Vertex from '../Vertex/Vertex';
import {stringToHashCode} from "@tgillespie/hash-data-structures";

class NamedVertex extends Vertex {
	name: string;

	constructor(name: string) {
		super();
		this.name = name;
	}

	compareTo(other: this): number {
		return this.name.localeCompare(other.name);
	}

	equals(other: any): boolean {
		return other instanceof NamedVertex && this.name === other.name;
	}

    hashCode(): number {
        return stringToHashCode(this.name);
    }
}

export default NamedVertex;
