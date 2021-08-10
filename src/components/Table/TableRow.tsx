/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { darken } from 'polished';
import React, { memo, useCallback } from 'react';
import { BackgroundColorProps, ColorProps, cssBreakpoints } from '../../common';
import { CellWidth, InnerTableCellValue } from '../../types/table';
import TableCell from './TableCell';

interface TableCellContainerStyleProps {
    hoverColor?: string;
    hoverBackgroundColor?: string;
    selected?: boolean;
    selectedColor?: string;
    selectedBackgroundColor?: string;
}

const TableRowContainer = styled.tr<TableCellContainerStyleProps & BackgroundColorProps & ColorProps>`
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #e8e8e8;

    ${(props) => css`
        ${cssBreakpoints('color', props.selected ? props.selectedColor : props.color, (value) => value)}
        ${cssBreakpoints(
            'background-color',
            props.selected ? props.selectedBackgroundColor : props.backgroundColor,
            (value) => value
        )}
    `}

    &:hover {
        color: ${(props) => props.hoverColor || ''};
        background-color: ${(props) => props.hoverBackgroundColor || ''};
    }
`;

interface TableRowProps {
    rowKey: string;
    index: number;
    values: InnerTableCellValue[];
    columnWidthList: CellWidth[];
    defaultColumnWidthPercent: string;
    color?: string;
    backgroundColor?: string;
    selectedColor?: string;
    selectedBackgroundColor?: string;
    hoverColor?: string;
    hoverBackgroundColor?: string;
    selected?: boolean;
    showGrid?: boolean;
    onClick?: (rowKey: string, data: InnerTableCellValue[]) => void;
}

const TableRow: React.FC<TableRowProps> = memo(
    ({
        rowKey,
        index,
        values,
        columnWidthList,
        defaultColumnWidthPercent,
        color,
        backgroundColor,
        selectedColor,
        selectedBackgroundColor = '#5B91FF',
        hoverColor,
        hoverBackgroundColor,
        selected,
        showGrid,
        onClick,
    }) => {
        const onRowClick = useCallback(() => {
            onClick?.(rowKey, values);
        }, [onClick, rowKey, values]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[TableRow]', 'Rendered', rowKey);
            console.log({
                index,
                values,
                columnWidthList,
                defaultColumnWidthPercent,
                color,
                backgroundColor,
                selectedColor,
                selectedBackgroundColor,
                hoverColor,
                hoverBackgroundColor,
                selected,
                showGrid,
                onClick,
            });
            console.groupEnd();
        }

        return (
            <TableRowContainer
                selected={selected}
                color={color}
                backgroundColor={backgroundColor}
                selectedColor={selectedColor}
                selectedBackgroundColor={selectedBackgroundColor}
                hoverColor={hoverColor}
                hoverBackgroundColor={selected ? darken(0.1, selectedBackgroundColor) : hoverBackgroundColor}
                onClick={onRowClick}
            >
                {values.map((value, columnIndex) => {
                    return (
                        <TableCell
                            rowIndex={index}
                            columnIndex={columnIndex}
                            width={columnWidthList[columnIndex]}
                            defaultWidth={defaultColumnWidthPercent}
                            value={value}
                            key={`cell_${index}_${columnIndex}`}
                            showAllGrid={showGrid}
                        ></TableCell>
                    );
                })}
            </TableRowContainer>
        );
    }
);

export default TableRow;
