import { Hashable, MutableHashMap } from '@tgillespie/hash-data-structures';

export abstract class Matrix<RowType extends Hashable, ColumnType extends Hashable, ValueType> {
	defaultValue: ValueType;
	matrix: MutableHashMap<RowType, MutableHashMap<ColumnType, ValueType>> = new MutableHashMap();

	protected constructor(defaultValue: ValueType) {
		this.defaultValue = defaultValue;
	}

	set(row: RowType, column: ColumnType, value: ValueType): void {
		if (!this.matrix.has(row)) this.matrix.set(row, new MutableHashMap());

		this.matrix.get(row)!.set(column, value);
	}

	get(row: RowType, column: ColumnType): ValueType {
		const rowData = this.matrix.get(row);
		if (rowData === undefined) return this.defaultValue;

		const cellData = rowData.get(column);
		if (cellData === undefined) return this.defaultValue;

		return cellData;
	}

	deleteRow(row: RowType): void {
		this.matrix.delete(row);
	}

	deleteColumn(column: ColumnType) {
		for (const row of this.matrix.values()) {
			row.delete(column);
		}
	}
}
