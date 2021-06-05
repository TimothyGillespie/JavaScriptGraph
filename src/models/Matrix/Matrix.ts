abstract class Matrix<RowType, ColumnType, ValueType> {
	defaultValue: ValueType;
	matrix: Map<RowType, Map<ColumnType, ValueType>> = new Map();

	constructor(defaultValue: ValueType) {
		this.defaultValue = defaultValue;
	}

	set(row: RowType, column: ColumnType, value: ValueType): void {
		if (!this.matrix.has(row)) this.matrix.set(row, new Map());

		this.matrix.get(row)!.set(column, value);
	}

	get(row: RowType, column: ColumnType): ValueType {
		const rowData = this.matrix.get(row);
		if (rowData === undefined) return this.defaultValue;

		const cellData = rowData.get(column);
		if (cellData === undefined) return this.defaultValue;

		return cellData;
	}
}

export default Matrix;
