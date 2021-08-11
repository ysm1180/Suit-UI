import { CSSProperties } from 'react';

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export enum COLUMN_SORT_STATE {
    NONE,
    ASC,
    DESC,
}

export interface HasChildCellidth {
    width: RawCellWidth;
    children: CellWidth[];
}

export type CellWidth = RawCellWidth | HasChildCellidth;

export interface CellWithStyle {
    content: string;
    style?: CSSProperties;
}

export interface TableColumnInfo<T extends string> {
    title: string;
    dataIndex: T;
    align?: string;
    type?: 'string' | 'number' | 'percent' | 'json';
    sort?: boolean;
    filter?: boolean;
    width?: RawCellWidth;
    children?: TableColumnInfo<T>[];
    show?: boolean;
    help?: boolean;
    description?: string;
}

export type RawCellWidth = number | string | undefined;

export type RawCellValue = string | number;

export type RawCell = RawCellValue | CellWithStyle;

export interface CellRows {
    rows: RawCell[];
}

export type CellValue = RawCell | CellRows;

export type Cell<T extends string> = CellValue | { [key in T]?: Cell<T> };

export type CellValues<T extends string> = {
    [Key in T]?: Cell<T>;
};

export type TableRowValue<T extends string> = CellValues<T> & {
    key: string;
};

export type InnerTableCellValue = CellValue | InnerTableCellValue[];

export type RowContents<T extends string> = { [key in T]?: string[] };
