abstract class Matrix<RowType, ColumnType, ValueType> {
	defaultValue: ValueType;
	// ToDo: Make own map which takes in an equality argument
	matrix: Map<string, Map<string, ValueType>> = new Map();

	constructor(defaultValue: ValueType) {
		this.defaultValue = defaultValue;
	}

	set(row: RowType, column: ColumnType, value: ValueType): void {
		const rowJson = JSON.stringify(row);
		const columnJson = JSON.stringify(column);
		if (!this.matrix.has(rowJson)) this.matrix.set(rowJson, new Map());

		this.matrix.get(rowJson)!.set(columnJson, value);
	}

	get(row: RowType, column: ColumnType): ValueType {
		const rowJson = JSON.stringify(row);
		const columnJson = JSON.stringify(column);

		const rowData = this.matrix.get(rowJson);
		if (rowData === undefined) return this.defaultValue;

		const cellData = rowData.get(columnJson);
		if (cellData === undefined) return this.defaultValue;

		return cellData;
	}
}

export default Matrix;
