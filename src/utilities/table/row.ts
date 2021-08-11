import { CellValues, RowContents } from '../../types';
import { extractValuesInCell } from './cell';

export const getRowContent = <T extends string>(row: CellValues<T>) => {
    const result: RowContents<T> = {};
    const keys = Object.keys(row);
    for (const key of keys) {
        result[key as T] = extractValuesInCell(row[key as T]);
    }
    return result;
};
