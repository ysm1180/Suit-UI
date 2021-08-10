import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import {
    InnerTableCellValue,
    CellWidth,
    RawCellWidth,
    HasChildCellidth,
    CellValue,
    CellRows,
    CellWithStyle,
} from '../../types/table';

interface TableCellStyleProps {
    showAllGrid: boolean;
    showGrid?: {
        left?: boolean;
        right?: boolean;
        top?: boolean;
        bottom?: boolean;
    };
    width?: RawCellWidth;
    p?: string;
}

const TableCellContainer = styled.td<TableCellStyleProps>`
    box-sizing: border-box;
    width: ${(props) => props.width};
    padding: ${(props) => props.p};
    border-left: ${(props) => (props.showAllGrid || props.showGrid?.left ? '1px solid #E8E8E8' : '')};
    &:last-child {
        border-right: ${(props) => (props.showAllGrid || props.showGrid?.right ? '1px solid #E8E8E8' : '')};
    }
    border-bottom: ${(props) => (props.showAllGrid || props.showGrid?.bottom ? '1px solid #E8E8E8' : '')};
    font-size: 13px;
    word-break: break-all;
    white-space: pre-wrap;
    vertical-align: middle;
`;

interface TableCellProps {
    rowIndex: number;
    columnIndex: number;
    value: InnerTableCellValue;
    width: CellWidth;
    defaultWidth: RawCellWidth;
    showAllGrid?: boolean;
    showGrid?: {
        left?: boolean;
        right?: boolean;
        top?: boolean;
        bottom?: boolean;
    };
}

const TableCell: React.FC<TableCellProps> = ({
    rowIndex,
    columnIndex,
    value,
    width,
    defaultWidth,
    showAllGrid = false,
    showGrid,
}) => {
    const hasChild = Array.isArray(value);

    const defaultChildCellWidthPercent = useMemo(() => {
        if (typeof width === 'object') {
            const columnWidth = width;
            let maxWidthPercent = 100;
            const explicitColumnWidthList = columnWidth.children.filter((width) => !!width).map((width) => width);
            for (const columnWidth of explicitColumnWidthList) {
                if (typeof columnWidth !== 'object' && columnWidth) {
                    const match = /\d+/.exec(`${columnWidth}`);
                    if (match) {
                        maxWidthPercent -= Number(match[0]);
                    }
                }
            }
            return `${maxWidthPercent / (columnWidth.children.length - explicitColumnWidthList.length)}%`;
        } else {
            return 0;
        }
    }, [width]);

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[TableCell]', 'Rendered');
        console.log({
            rowIndex,
            columnIndex,
            value,
            width,
            defaultWidth,
            showAllGrid,
            showGrid,
        });
        console.groupEnd();
    }

    if (hasChild) {
        const columnWidth = width as HasChildCellidth;
        const cellValues = value as CellValue[];
        return (
            <TableCellContainer
                showAllGrid={showAllGrid}
                showGrid={showGrid}
                width={columnWidth?.width ?? defaultWidth}
            >
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            {cellValues.map((cellValue, index) => {
                                return (
                                    <TableCell
                                        key={`cell_${rowIndex}_${columnIndex}_c${index}`}
                                        rowIndex={rowIndex}
                                        columnIndex={columnIndex + 1}
                                        value={cellValue}
                                        width={columnWidth.children[index]}
                                        defaultWidth={defaultChildCellWidthPercent}
                                        showAllGrid={showAllGrid}
                                        showGrid={showGrid}
                                    />
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </TableCellContainer>
        );
    } else {
        let hasRows = false;
        let content = value;
        let style: React.CSSProperties = {};
        if (typeof value == 'object') {
            hasRows = (value as CellRows).rows !== undefined;
            content = (value as CellWithStyle).content ?? '';
            style = (value as CellWithStyle).style ?? {};
        }

        if (hasRows) {
            const rows = (value as CellRows).rows;
            return (
                <TableCellContainer
                    showAllGrid={showAllGrid}
                    showGrid={showGrid}
                    width={(width as RawCellWidth | undefined) ?? defaultWidth}
                >
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {rows.map((cellValue, index) => {
                                return (
                                    <tr key={`cell_${rowIndex}_${columnIndex}_r${index}`}>
                                        <TableCell
                                            rowIndex={rowIndex}
                                            columnIndex={columnIndex}
                                            value={cellValue}
                                            width={100}
                                            defaultWidth={defaultWidth}
                                            showGrid={index < rows.length - 1 ? { bottom: true } : undefined}
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </TableCellContainer>
            );
        }

        return (
            <TableCellContainer
                showAllGrid={showAllGrid}
                showGrid={showGrid}
                width={(width as RawCellWidth | undefined) ?? defaultWidth}
                key={`cell_${rowIndex}_${columnIndex}`}
                p="7px"
                style={style}
            >
                {content}
            </TableCellContainer>
        );
    }
};

export default TableCell;
