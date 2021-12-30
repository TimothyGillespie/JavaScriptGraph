import {Graph} from '../models/Graph/Graph';

export interface IStringParser<G extends Graph<any, any>> {
	/**
	 * Takes the complete input of the string to be parsed.
	 * @param input the input of the standard
	 * @return true if the input was accepted, false otherwise
	 */
	read(input: string): boolean;

	/**
	 * Performs one parsing step.
	 * @return The graph that has been generated so far; null if there is no step to parse anymore
	 */
	parseNextStep(): G | null;

	/**
	 * Parses the complete input and returns the resulting Graph
	 * @param input
	 */
	parse(input: string): G;
}
