import { Cell, CellRows, CellWithStyle } from '../../types/table';

export const extractValuesInCell: <T extends string>(_?: Cell<T>) => string[] = <T extends string>(cell?: Cell<T>) => {
    if (!cell) {
        return [''];
    }

    let content = cell.toString();
    if (typeof cell === 'object') {
        const cellRows = (cell as CellRows).rows;
        if (cellRows !== undefined) {
            return cellRows.map((row) => {
                if (typeof row === 'object') {
                    return row.content;
                } else {
                    return row.toString();
                }
            });
        } else {
            content = (cell as CellWithStyle).content ?? '';
        }
    }

    return [content];
};

export const getPercentText = (str: string, decimalPoint: number) => {
    return `${
        Math.floor(
            (Math.floor(Number(str) * Math.pow(10, decimalPoint)) / Math.pow(10, decimalPoint)) *
                Math.pow(10, decimalPoint)
        ) / Math.pow(10, decimalPoint)
    }%`;
};
