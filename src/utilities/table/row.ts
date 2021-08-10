import { CellValues, RowContents } from '../../types/table';
import { extractValuesInCell } from './cell';

export const getRowContent = <T extends string>(row: CellValues<T>) => {
    const result: RowContents<T> = {};
    const keys = Object.keys(row);
    for (const key of keys) {
        const cellValues = extractValuesInCell(row[key as T]);
        result[key as T] = cellValues;
    }
    return result;
};
