/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
    backgroundColor,
    BackgroundColorProps,
    CssCursor,
    HeightProps,
    textColor,
    TextColorProps,
    WidthProps,
} from '../../common';
import { Flex, FlexboxProps } from '../../base';
import {
    Cell,
    CellRows,
    CellValue,
    CellValues,
    CellWidth,
    CellWithStyle,
    COLUMN_SORT_STATE,
    InnerTableCellValue,
    Rect,
    RowContents,
    TableColumnInfo,
    TableRowValue,
} from '../../types/table';
import { extractValuesInCell, getPercentText, getRowContent } from '../../utilities';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import TableColumn from './TableColumn';
import TableColumnFilter from './TableColumnFilter';
import TableRow from './TableRow';
import { CustomTableTheme, DefaultTableDarkTheme, DefaultTableLightTheme } from './theme';

type DisplayAction<T extends string> =
    | { type: 'SET'; data: unknown[] }
    | { type: 'ASC'; column: TableColumnInfo<T> | undefined; key: string; init: () => void }
    | { type: 'DESC'; column: TableColumnInfo<T> | undefined; key: string; init: () => void };

interface DisplayTableData<U extends string, T extends TableRowValue<U>> {
    data: T[];
    columnKey: string;
    init?: () => void;
}

const tableDataReducer = <U extends string, T extends TableRowValue<U>>(
    state: DisplayTableData<U, T>,
    action: DisplayAction<U>
) => {
    let sortedData = [];
    switch (action.type) {
        case 'ASC':
            sortedData = [...state.data].sort((a, b) => {
                if (action.column) {
                    if (!action.column.type || action.column.type === 'string') {
                        return `${extractValuesInCell(a[action.column.dataIndex])[0]}`.localeCompare(
                            `${extractValuesInCell(b[action.column.dataIndex])[0]}`
                        );
                    } else if (action.column.type === 'number' || action.column.type === 'percent') {
                        return (
                            Number(extractValuesInCell(a[action.column.dataIndex])[0]) -
                            Number(extractValuesInCell(b[action.column.dataIndex])[0])
                        );
                    }
                }

                return 0;
            });
            return { data: sortedData, columnKey: action.key, init: action.init };
        case 'DESC':
            sortedData = [...state.data].sort((a, b) => {
                if (action.column) {
                    if (!action.column.type || action.column.type === 'string') {
                        return `${extractValuesInCell(b[action.column.dataIndex])[0]}`.localeCompare(
                            `${extractValuesInCell(a[action.column.dataIndex])[0]}`
                        );
                    } else if (action.column.type === 'number' || action.column.type === 'percent') {
                        return (
                            Number(extractValuesInCell(b[action.column.dataIndex])[0]) -
                            Number(extractValuesInCell(a[action.column.dataIndex])[0])
                        );
                    }
                }

                return 0;
            });
            return { data: sortedData, columnKey: action.key, init: action.init };
        case 'SET':
            return { ...state, data: action.data as T[], columnKey: '' };
        default:
            return { ...state };
    }
};

interface TableColumnContainerStyleProps {
    isItemScroll?: boolean;
}

const TableColumnContainer = styled.div<TableColumnContainerStyleProps & BackgroundColorProps & TextColorProps>`
    position: relative;
    z-index: 1;

    &::-webkit-scrollbar {
        height: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
        border-radius: 0;
    }

    ${backgroundColor}

    ${textColor}

    overflow-y: ${(props) => (props.isItemScroll ? 'scroll' : 'hidden')};
`;

interface TableBodyContainerStyleProps {
    showColumn?: boolean;
    borderColor?: string;
    backgroundColor?: string;
    cursor: string;
}

const TableBodyContainer = styled.table<TableBodyContainerStyleProps & TextColorProps>`
    width: 100%;
    border-spacing: 0;
    position: relative;
    overflow: auto;

    background-color: ${(props) => props.backgroundColor};
    border-top: ${(props) => (!props.showColumn ? `1px solid ${props.borderColor ?? '#E8E8E8'}` : '')};
    cursor: ${(props) => props.cursor};

    ${textColor}
`;

const TableBody = styled.tbody`
    width: 100%;
`;

export interface TableProps<U extends string> extends WidthProps, HeightProps{
    columns?: TableColumnInfo<U>[];
    showColumn?: boolean;
    showGrid?: boolean;
    rows?: TableRowValue<U>[];
    filter?: (rowData: RowContents<U>) => boolean;
    height?: number;
    loading?: boolean;
    onRowClick?: (rowData: RowContents<U>) => void;
    cursor?: CssCursor;
    rowHoverBackgroundColor?: string;
    rowBackgroundColor?: string;
    rowHoverTextColor?: string;
    rowTextColor?: string;
    rowColorFilter?: (
        rowIndex: number,
        rowData: RowContents<U>
    ) => { background?: string | null | false; text?: string | null | false };
    selectable?: boolean;
    onVisibleRowsChange?: (rows: RowContents<U>[]) => void;
    percentDecimalPoint?: number;
    dark?: boolean;
    theme?: CustomTableTheme;
}

const Table = <Keys extends string>({
    columns = [],
    showColumn = true,
    showGrid = false,
    rows,
    filter,
    loading = false,
    height = -1,
    cursor = 'default',
    onRowClick,
    rowTextColor,
    rowBackgroundColor,
    rowHoverTextColor,
    rowHoverBackgroundColor,
    rowColorFilter,
    selectable,
    onVisibleRowsChange,
    percentDecimalPoint = 4,
    dark = false,
    theme,
    ...props
}: TableProps<Keys> & Omit<FlexboxProps, keyof TableProps<Keys> | 'flexDirection' | 'position'>) => {
    type R = TableRowValue<Keys>;

    const [isItemScroll, setIsItemScroll] = useState(false);
    const [selectedRowKey, setSelectedRowKey] = useState('');
    const [columnFilterStates, setColumnFilterStates] = useState<{ [key: string]: boolean }>({});
    const [columnFilters, setColumnFilters] = useState<{ [key: string]: string[] }>({});
    const [columnRects, setColumnRects] = useState<{ [key: string]: Rect }>({});
    const [currentTheme, setCurrentTheme] = useState<CustomTableTheme>(
        theme ?? dark ? DefaultTableDarkTheme : DefaultTableLightTheme
    );
    const boxRef = useRef<HTMLTableSectionElement>(null);

    const filterRows = useMemo(() => {
        return (rows ?? []).filter((row) => {
            const keys = Object.keys(row);
            for (const key of keys) {
                if (columnFilters?.[key]?.length > 0) {
                    const cellValues = extractValuesInCell(row[key as Keys]);
                    if (!columnFilters?.[key]?.find((selected) => cellValues.includes(selected))) {
                        return false;
                    }
                }
            }

            return filter?.(getRowContent(row)) ?? true;
        });
    }, [rows, filter, columnFilters]);

    useEffect(() => {
        onVisibleRowsChange?.(filterRows.map((row) => getRowContent(row)));
    }, [filterRows, onVisibleRowsChange]);

    const [displayData, displayDataDispatch] = useReducer(tableDataReducer, {
        data: filterRows,
        columnKey: '',
        init: undefined,
    });

    const displayColumns = useMemo(() => columns.filter((column) => column.show ?? true), [columns]);

    const defaultColumnWidthPercent = useMemo(() => {
        let maxWidthPercent = 100;
        const explicitColumnWidthList = displayColumns.filter((column) => !!column.width).map((column) => column.width);
        for (const columnWidth of explicitColumnWidthList) {
            if (typeof columnWidth === 'string') {
                const match = /\d+/.exec(columnWidth);
                if (match) {
                    maxWidthPercent -= Number(match[0]);
                }
            }
        }
        return `${maxWidthPercent / (displayColumns.length - explicitColumnWidthList.length)}%`;
    }, [displayColumns]);

    useEffect(() => {
        displayDataDispatch({ type: 'SET', data: filterRows });
    }, [filterRows, displayDataDispatch]);

    useEffect(() => {
        if (boxRef && boxRef.current) {
            if (height !== -1 && boxRef.current.offsetHeight > height) {
                setIsItemScroll(true);
            }
        }
    }, [displayData.data.length, height]);

    useEffect(() => {
        setCurrentTheme(theme ?? (dark ? DefaultTableDarkTheme : DefaultTableLightTheme));
    }, [dark, theme]);

    const onHeaderColumnSort = useCallback(
        (columnDataIndex: string, nextSortState: COLUMN_SORT_STATE, init: () => void) => {
            if (displayData.columnKey === columnDataIndex) {
                if (nextSortState === COLUMN_SORT_STATE.DESC) {
                    displayDataDispatch({
                        type: 'DESC',
                        column: displayColumns.find((column) => column.dataIndex === columnDataIndex),
                        key: columnDataIndex,
                        init,
                    });
                } else if (nextSortState === COLUMN_SORT_STATE.ASC) {
                    displayDataDispatch({
                        type: 'ASC',
                        column: displayColumns.find((column) => column.dataIndex === columnDataIndex),
                        key: columnDataIndex,
                        init,
                    });
                } else if (nextSortState === COLUMN_SORT_STATE.NONE) {
                    displayDataDispatch({ type: 'SET', data: filterRows });
                }
            } else {
                displayData.init?.();
                displayDataDispatch({
                    type: 'DESC',
                    column: displayColumns.find((column) => column.dataIndex === columnDataIndex),
                    key: columnDataIndex,
                    init,
                });
            }
        },
        [displayColumns, displayData, displayDataDispatch, filterRows]
    );

    const onFilterStateChange = useCallback((columnDataIndex: string, showFilter: boolean) => {
        setColumnFilterStates((s) => ({ ...s, [columnDataIndex]: showFilter }));
    }, []);

    const onFilterChange = useCallback((columnDataIndex: string, filters: string[]) => {
        setColumnFilters((s) => ({ ...s, [columnDataIndex]: filters }));
        setColumnFilterStates((s) => ({ ...s, [columnDataIndex]: false }));
    }, []);

    const toColumnValue: (_: TableColumnInfo<Keys>[], innerRowData: InnerTableCellValue[]) => R = useCallback(
        (columns: TableColumnInfo<Keys>[], rowData: InnerTableCellValue[]) => {
            return columns.reduce(
                (prev, cur, index) => ({
                    ...prev,
                    [cur.dataIndex]:
                        cur.children && cur.children.length > 0
                            ? toColumnValue(cur.children, rowData[index] as InnerTableCellValue[])
                            : rowData[index],
                }),
                {}
            ) as R;
        },
        []
    );

    const onRowClickEvent = useCallback(
        (rowKey: string, rowData: InnerTableCellValue[]) => {
            if (selectable) {
                setSelectedRowKey(rowKey);
            }
            const data = toColumnValue(displayColumns, rowData);
            onRowClick?.(getRowContent(data));
        },
        [onRowClick, displayColumns, selectable, toColumnValue]
    );

    const onColumnRectUpdate = useCallback((columnKey: string, rect: Rect) => {
        setColumnRects((s) => ({ ...s, [columnKey]: rect }));
    }, []);

    const rowFilterColors = useMemo(() => {
        return displayData.data.map((values, index) => {
            const filterColor = rowColorFilter?.(index, getRowContent(values));
            return filterColor ? filterColor : undefined;
        });
    }, [displayData.data, rowColorFilter]);

    const rowDataList: InnerTableCellValue[][] = useMemo(() => {
        const getColumnValue: (
            columns: TableColumnInfo<Keys>[],
            cellValues: CellValues<Keys>
        ) => InnerTableCellValue[] = (argColumns: TableColumnInfo<Keys>[], cellValues: CellValues<Keys>) => {
            return argColumns.map((column) => {
                if (!column.children || column.children.length === 0) {
                    // when column type is percent
                    if (column.type === 'percent') {
                        const originalCellValue: Cell<Keys> = cellValues?.[column.dataIndex] ?? '';
                        if (typeof originalCellValue === 'object') {
                            const cellRows = (originalCellValue as CellRows).rows;
                            // cell rows exists
                            if (cellRows !== undefined) {
                                const cloneCellValue: CellRows = { rows: [] };
                                cloneCellValue.rows = cellRows.map((row) => {
                                    if (typeof row === 'object') {
                                        const cloneRow = { ...row };
                                        cloneRow.content = getPercentText(row.content, percentDecimalPoint);
                                        return cloneRow;
                                    } else {
                                        return getPercentText(row.toString(), percentDecimalPoint);
                                    }
                                });

                                return cloneCellValue;
                            } else {
                                const cloneCellValue: CellWithStyle = {
                                    content: getPercentText(
                                        (originalCellValue as CellWithStyle).content,
                                        percentDecimalPoint
                                    ),
                                    style: (originalCellValue as CellWithStyle).style,
                                };

                                return cloneCellValue;
                            }
                        } else {
                            return getPercentText(
                                extractValuesInCell(cellValues?.[column.dataIndex])[0],
                                percentDecimalPoint
                            );
                        }
                    }

                    return cellValues[column.dataIndex] as CellValue;
                }

                return getColumnValue(column.children, cellValues[column.dataIndex] ?? '');
            });
        };

        return displayData.data.map((values: TableRowValue<Keys>) => {
            return getColumnValue(displayColumns, values);
        });
    }, [displayData.data, displayColumns, percentDecimalPoint]);

    const columnWidthList = useMemo(() => {
        const getColumnValue: (argColumns: TableColumnInfo<Keys>[]) => CellWidth[] = (
            argColumns: TableColumnInfo<Keys>[]
        ) => {
            return argColumns.map((column) => {
                if (!column.children || column.children.length === 0) {
                    return column.width;
                } else {
                    return { width: column.width, children: getColumnValue(column.children) };
                }
            });
        };
        return getColumnValue(displayColumns);
    }, [displayColumns]);

    const uniqueCellValueList = useMemo(() => {
        const pureFilterRows = (rows ?? []).filter((row) => filter?.(getRowContent(row)) ?? true);
        return pureFilterRows.reduce<{ [key: string]: string[] }>((prev, cur) => {
            for (const key in cur) {
                const values = extractValuesInCell(cur[key as Keys]);
                for (const value of values) {
                    if (prev[key] === undefined) {
                        prev[key] = [];
                    }

                    if (!prev[key].includes(value)) {
                        prev[key].push(value);
                    }
                }
            }
            return prev;
        }, {});
    }, [rows, filter]);

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[Table]', 'Rendered');
        console.log({
            columns,
            showColumn,
            showGrid,
            rows,
            filter,
            loading,
            height,
            cursor,
            onRowClick,
            rowTextColor,
            rowBackgroundColor,
            rowHoverTextColor,
            rowHoverBackgroundColor,
            rowColorFilter,
            selectable,
            onVisibleRowsChange,
            percentDecimalPoint,
            dark,
            theme,
            ...props,
        });
        console.groupEnd();
    }

    return (
        <Flex {...props} flexDirection="column" position="relative">
            {showColumn && (
                <TableColumnContainer
                    isItemScroll={isItemScroll}
                    backgroundColor={currentTheme.column.backgroundColor}
                    color={currentTheme.column.color ?? currentTheme.color}
                >
                    <Flex width="100%">
                        {displayColumns.map((column) => (
                            <TableColumn
                                key={column.dataIndex}
                                columnKey={column.dataIndex}
                                onSortStateChange={onHeaderColumnSort}
                                text={column.title}
                                width={column.width ?? defaultColumnWidthPercent}
                                sort={column.sort}
                                align={column.align}
                                filter={column.filter}
                                showFilterState={columnFilterStates[column.dataIndex]}
                                setFilters={(columnFilters[column.dataIndex]?.length ?? 0) > 0}
                                help={column.help}
                                description={column.description}
                                onFilterStateChange={onFilterStateChange}
                                onColumnRectUpdate={onColumnRectUpdate}
                                children={column.children}
                                backgroundColor={currentTheme.column.backgroundColor}
                                hoverBackgroundColor={currentTheme.column.hoverBackgroundColor}
                                showGrid={showGrid}
                            />
                        ))}
                    </Flex>
                </TableColumnContainer>
            )}
            {showColumn &&
                columns
                    .filter((column) => column.filter)
                    .map((column) => {
                        const key = column.dataIndex;
                        if (columnFilterStates[key]) {
                            const checks = columnFilters[key]?.reduce<{ [key: string]: boolean }>((prev, cur) => {
                                prev[cur] = true;
                                return prev;
                            }, {});
                            return (
                                <TableColumnFilter
                                    key={key}
                                    columnDataIndex={column.dataIndex}
                                    left={(columnRects[key]?.width ?? 0) + (columnRects[key]?.left ?? 0)}
                                    top={(columnRects[key]?.height ?? 0) + (columnRects[key]?.top ?? 0)}
                                    data={uniqueCellValueList[column.dataIndex] ?? []}
                                    checks={checks}
                                    onFilterChange={onFilterChange}
                                    textColor={currentTheme.color}
                                    backgroundColor={currentTheme.column.backgroundColor}
                                    maxHeight={height !== -1 ? height : undefined}
                                />
                            );
                        }
                        return undefined;
                    })}
            <div
                css={css`
                    overflow: auto;
                    height: ${height !== -1 && `${height}px`};
                `}
            >
                <TableBodyContainer
                    cursor={cursor}
                    showColumn={showColumn}
                    borderColor={currentTheme.borderColor}
                    color={currentTheme.color}
                >
                    <TableBody ref={boxRef}>
                        {displayData.data.map((values, rowIndex) => (
                            <TableRow
                                key={values.key}
                                rowKey={values.key}
                                index={rowIndex}
                                onClick={onRowClickEvent}
                                color={rowFilterColors[rowIndex]?.text || rowTextColor}
                                backgroundColor={rowFilterColors[rowIndex]?.background || rowBackgroundColor}
                                selectedBackgroundColor={currentTheme.row?.selectedBackgroundColor}
                                hoverColor={rowHoverTextColor}
                                hoverBackgroundColor={rowHoverBackgroundColor}
                                values={rowDataList[rowIndex]}
                                selected={selectedRowKey === values.key}
                                columnWidthList={columnWidthList}
                                defaultColumnWidthPercent={defaultColumnWidthPercent}
                                showGrid={showGrid}
                            ></TableRow>
                        ))}
                    </TableBody>
                </TableBodyContainer>
                {loading && (
                    <Flex
                        css={css`
                            padding: 12px 0;
                        `}
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon icon={icons.regular.spinner} spin />
                    </Flex>
                )}
            </div>
        </Flex>
    );
};
export default Table;
