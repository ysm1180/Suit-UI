/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { memo, useEffect, useState } from 'react';
import { GridCellRenderer } from 'react-virtualized';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import ColumnSizer from 'react-virtualized/dist/es/ColumnSizer';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid';
import 'react-virtualized/styles.css';
import { backgroundColor, BackgroundColorProps } from '../../common';
import { Flex } from '../../base';
import { Icon } from '../Icon';
import icons from '../Icon/icons';

const TableCell = styled.div<BackgroundColorProps>`
    display: flex;
    flex: 1;
    font-size: 13px;
    padding: 4px;

    ${backgroundColor}

    ${(props) =>
        props.draggable &&
        css`
            cursor: move;
            &:hover {
                background-color: #666666;
                color: white;
            }
        `}
`;

export interface VirtualTableProps {
    columns?: string[];
    rows?: { [key: string]: string | JSX.Element | undefined | null }[];
    maxDisplayColumns?: number;
    loading?: boolean;
    emphasizeRowIndex?: number;
    draggable?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    height?: number;
    rowHeight?: number;
}

const CustomVirtualTable: React.FC<VirtualTableProps> = memo(
    ({
        columns = [],
        rows = [],
        maxDisplayColumns = columns.length,
        loading = false,
        emphasizeRowIndex = -1,
        draggable = false,
        onDragStart,
        onDragEnd,
        height = 250,
        rowHeight = 26,
    }) => {
        const [maxColumnLength, setMaxColumnLength] = useState(
            maxDisplayColumns < columns.length ? maxDisplayColumns : columns.length
        );
        const onCellDragStart = (e: React.DragEvent) => {
            const data = e.currentTarget.getAttribute('data-drop');
            if (data) {
                e.dataTransfer.setData('data', data);
            }
            if (onDragStart) {
                onDragStart();
            }
        };

        const onCellDragEnd = (e: React.DragEvent) => {
            if (onDragEnd) {
                onDragEnd();
            }
        };

        useEffect(() => {
            let columnLength = maxDisplayColumns < columns.length ? maxDisplayColumns : columns.length;
            if (columnLength === 0) {
                columnLength = 1;
            }
            setMaxColumnLength(columnLength);
        }, [columns, maxDisplayColumns]);

        const cellRenderer: GridCellRenderer = ({ columnIndex, rowIndex, style, key, parent }) => {
            let value: string | JSX.Element | undefined | null = undefined;
            const isColumn = rowIndex === 0;
            if (isColumn) {
                value = columns[columnIndex];
            } else {
                if (rows[rowIndex - 1]) {
                    value = rows[rowIndex - 1][columns[columnIndex]];
                }
            }

            const isEmphasize = rowIndex > 0 && emphasizeRowIndex !== -1 && rowIndex - 1 === emphasizeRowIndex;
            const newStyle = Object.assign({}, style, { borderBottom: isColumn ? '2px solid #ccc' : '1px solid #eee' });
            return (
                <Flex style={newStyle} key={key} alignItems="center" flexGrow={1}>
                    <TableCell
                        key={columnIndex}
                        backgroundColor={isEmphasize ? '#FFC940' : ''}
                        draggable={!isColumn && draggable}
                        onDragStart={isColumn ? undefined : onCellDragStart}
                        onDragEnd={onCellDragEnd}
                        data-drop={value}
                    >
                        {typeof value === 'string' ? (
                            <div
                                title={value}
                                css={css`
                                    overflow: hidden;
                                    font-size: 13px;
                                    font-weight: ${isColumn ? 'bold' : 'normal'};
                                    text-overflow: ellipsis;
                                `}
                            >
                                {value}
                            </div>
                        ) : (
                            value
                        )}
                    </TableCell>
                </Flex>
            );
        };

        return (
            <div
                css={css`
                    height: ${`${height}px`};
                `}
            >
                <style>
                    {`
                    .ReactVirtualized__Grid {
                        overflow-x: hidden;
                    }

                    .ReactVirtualized__Grid::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }

                    .ReactVirtualized__Grid::-webkit-scrollbar-thumb {
                        cursor: pointer;
                        background: rgba(0, 0, 0, 0.25);
                        transition: color 0.2s ease;
                        border-radius: 5px;
                    }

                    .ReactVirtualized__Grid::-webkit-scrollbar-thumb:hover {
                        background: rgba(0, 0, 0, 0.35);
                    }

                    .ReactVirtualized__Grid::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.1);
                        border-radius: 0;
                    }
                    `}
                </style>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <ColumnSizer
                            width={width}
                            columnMinWidth={width / maxColumnLength}
                            columnCount={columns.length}
                        >
                            {({ adjustedWidth, columnWidth }) => (
                                <MultiGrid
                                    cellRenderer={cellRenderer}
                                    columnCount={columns.length}
                                    columnWidth={columnWidth}
                                    height={height}
                                    rowCount={rows.length + 1}
                                    rowHeight={rowHeight}
                                    width={adjustedWidth}
                                    fixedRowCount={1}
                                    scrollToRow={emphasizeRowIndex + 1}
                                ></MultiGrid>
                            )}
                        </ColumnSizer>
                    )}
                </AutoSizer>
                {loading && (
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        css={css`
                            margin-top: 20px;
                        `}
                    >
                        <Icon size="2x" icon={icons.regular.spinner} spin />
                    </Flex>
                )}
            </div>
            // <Box width={1} sx={{ position: 'relative', overflowX: 'auto', overflowY: 'auto' }} maxHeight={250}>
            //     <TableColumnContainer width={1}>
            //         {columns.map((column, index) => (
            //             <Box
            //                 display="inline-block"
            //                 backgroundColor="white"
            //                 sx={{
            //                     borderBottom: '2px solid #ccc',
            //                 }}
            //                 p={2}
            //                 width={1 / maxColumnLength}
            //                 key={index}
            //             >
            //                 <Text
            //                     title={column}
            //                     overflow="hidden"
            //                     style={{ fontSize: 14, fontWeight: 'bold', textOverflow: 'ellipsis' }}
            //                 >
            //                     {column}
            //                 </Text>
            //             </Box>
            //         ))}
            //     </TableColumnContainer>
            //     {data.map((values, index) => (
            //         <Box key={index} sx={{ whiteSpace: 'pre' }}>
            //             {values.map((value, index) => (
            //                 <TableCell
            //                     draggable={true}
            //                     onDragStart={onDrag}
            //                     data-drop={value}
            //                     sx={{
            //                         borderBottom: '1px solid #eee',
            //                     }}
            //                     p={2}
            //                     width={1 / maxColumnLength}
            //                     key={index}
            //                 >
            //                     <Text
            //                         title={value}
            //                         overflow="hidden"
            //                         style={{ fontSize: 13, textOverflow: 'ellipsis' }}
            //                     >
            //                         {value}
            //                     </Text>
            //                 </TableCell>
            //             ))}
            //         </Box>
            //     ))}

            //     {data.length > 0 && more && (
            //         <Button
            //             width="100%"
            //             backgroundColor="#5F6368"
            //             color="white"
            //             text="데이터 더 불러오기"
            //             onClick={onMore}
            //         />
            //     )}
            // </Box>
        );
    }
);

export default CustomVirtualTable;
