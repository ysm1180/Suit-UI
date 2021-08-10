/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { debounce } from 'lodash-es';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { backgroundColor, BackgroundColorProps, color, ColorProps, width } from '../../common';
import { Flex } from '../../base';
import { COLUMN_SORT_STATE, Rect, TableColumnInfo } from '../../types/table';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import Tooltip from '../Tooltip/Tooltip';

interface TableHeaderColumnContainerStyleProps {
    showGrid?: boolean;
}

const TableHeaderColumnContainer = styled(Flex)<TableHeaderColumnContainerStyleProps>`
    ${(props) =>
        props.showGrid &&
        css`
            border-top: 1px solid #e8e8e8;
            border-left: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            &:last-child {
                border-right: 1px solid #e8e8e8;
            }
        `}
`;

interface TableHeaderColumnStyleProps extends BackgroundColorProps {
    sort?: boolean;
    align?: string;
    hoverBackgroundColor?: string;
}

const TableHeaderColumn = styled.div<TableHeaderColumnStyleProps>`
    display: flex;
    flex-grow: 1;

    padding: 7px;
    justify-content: ${(props) => (props.sort ? 'space-between' : props.align)};
    align-items: center;

    cursor: ${(props) => (props.sort ? 'pointer' : '')};
    &:hover {
        background-color: ${(props) => (props.sort ? props.hoverBackgroundColor : '')};
    }

    ${backgroundColor}
`;

interface TableColumnFilterStyleProps {
    hoverBackgroundColor?: string;
}

const TableColumnFilter = styled.div<TableColumnFilterStyleProps & ColorProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 4px;

    outline: 0;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.hoverBackgroundColor};
    }

    ${color}
`;

interface TableColumnProps {
    columnKey: string;
    text: string;
    align?: string;
    sort?: boolean;
    filter?: boolean;
    showFilterState?: boolean;
    setFilters?: boolean;
    width?: string | number;
    showGrid?: boolean;
    onClick?: (columnKey: string) => void;
    onSortStateChange?: (columnKey: string, sortState: COLUMN_SORT_STATE, init: () => void) => void;
    onFilterStateChange?: (columnKey: string, showFilter: boolean) => void;
    onColumnRectUpdate?: (columnKey: string, rect: Rect) => void;
    children?: TableColumnInfo<string>[];
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    help?: boolean;
    description?: string;
}

const TableColumn: React.FC<TableColumnProps> = ({
    columnKey,
    text,
    align = '',
    sort = false,
    filter = false,
    showFilterState = false,
    setFilters = false,
    width,
    showGrid,
    onClick,
    onSortStateChange,
    onFilterStateChange,
    onColumnRectUpdate,
    children = [],
    backgroundColor,
    hoverBackgroundColor,
    help = false,
    description,
}) => {
    const [questionElement, setQuestionElement] = useState<HTMLSpanElement>();
    const [sortState, setSortState] = useState(COLUMN_SORT_STATE.NONE);
    const [showFilter, setShowFilter] = useState(showFilterState);
    const filterRef = useRef<HTMLDivElement>(null);
    const debounced = useRef(
        debounce((fn: ((key: string, rect: Rect) => void) | undefined, key: string, element: HTMLElement) => {
            const cumulativeOffset = (elm: HTMLElement) => {
                let top = 0;
                let left = 0;
                let node: HTMLElement | null = elm;
                while (node !== null) {
                    top += node.offsetTop || 0;
                    left += node.offsetLeft || 0;
                    node = node.offsetParent as HTMLElement;
                }

                return {
                    top: top,
                    left: left,
                };
            };

            const { top, left } = cumulativeOffset(element);
            fn?.(key, {
                top,
                left,
                width: element.offsetWidth,
                height: element.offsetHeight,
            });
        }, 100)
    );

    const onColumnClick = useCallback(() => {
        if (sort) {
            let nextSortState = COLUMN_SORT_STATE.NONE;
            if (sortState === COLUMN_SORT_STATE.NONE) {
                nextSortState = COLUMN_SORT_STATE.DESC;
            } else if (sortState === COLUMN_SORT_STATE.DESC) {
                nextSortState = COLUMN_SORT_STATE.ASC;
            } else if (sortState === COLUMN_SORT_STATE.ASC) {
                nextSortState = COLUMN_SORT_STATE.NONE;
            }
            onSortStateChange?.(columnKey, nextSortState, () => {
                setSortState(COLUMN_SORT_STATE.NONE);
            });
            setSortState(nextSortState);
        }
        onClick?.(columnKey);
    }, [columnKey, onClick, onSortStateChange, sort, sortState]);

    const onFilterIconClick = useCallback(() => {
        setShowFilter(!showFilter);
        onFilterStateChange?.(columnKey, !showFilter);
        filterRef?.current?.focus();
    }, [columnKey, showFilter, onFilterStateChange]);

    useEffect(() => {
        setShowFilter(showFilterState);
    }, [showFilterState]);

    const defaultChildWidthPercent = useMemo(() => {
        let maxWidthPercent = 100;
        const explicitColumnWidthList = children.filter((child) => !!child.width).map((child) => child.width);
        for (const columnWidth of explicitColumnWidthList) {
            if (typeof columnWidth === 'string') {
                const match = /\d+/.exec(columnWidth);
                if (match) {
                    maxWidthPercent -= Number(match[0]);
                }
            }
        }
        return `${maxWidthPercent / (children.length - explicitColumnWidthList.length)}%`;
    }, [children]);

    const columnRef = useCallback(
        (node: HTMLDivElement) => {
            const update = () => {
                debounced.current(onColumnRectUpdate, columnKey, node);
            };

            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio > 0) {
                            update();
                        }
                    });
                },
                {
                    root: document.documentElement,
                }
            );

            if (node !== null) {
                update();
                window.addEventListener('resize', update);
                observer.observe(node);
            } else {
                window.removeEventListener('resize', update);
                observer.disconnect();
            }
        },
        [columnKey, onColumnRectUpdate]
    );

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[TableColumn]', 'Rendered');
        console.log({
            columnKey,
            text,
            align,
            sort,
            filter,
            showFilterState,
            setFilters,
            width,
            showGrid,
            onClick,
            onSortStateChange,
            onFilterStateChange,
            onColumnRectUpdate,
            children,
            backgroundColor,
            hoverBackgroundColor,
            help,
            description,
        });
        console.groupEnd();
    }

    return (
        <TableHeaderColumnContainer width={width} ref={columnRef} showGrid={showGrid} flexDirection="column">
            <Flex width="100%" flexDirection="row" flexGrow={1}>
                <TableHeaderColumn
                    key={columnKey}
                    onClick={onColumnClick}
                    sort={sort}
                    align={align}
                    backgroundColor={backgroundColor}
                    hoverBackgroundColor={hoverBackgroundColor}
                >
                    <Flex
                        css={css`
                            font-size: 13px;
                            font-weight: 600;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-break: break-word;
                        `}
                        flexDirection="row"
                        alignItems="center"
                    >
                        <span title={text}>{text}</span>

                        {help && (
                            <Fragment>
                                <span
                                    css={css`
                                        margin-left: 5px;
                                    `}
                                    ref={(ref) => setQuestionElement(ref ?? undefined)}
                                >
                                    <Icon icon={icons.regular.questionCircle} />
                                </span>
                                <Tooltip target={questionElement}>{description}</Tooltip>
                            </Fragment>
                        )}
                    </Flex>
                    {sort && (
                        <Flex flexDirection="column">
                            <div
                                css={css`
                                    height: 10px;
                                `}
                            >
                                <Icon
                                    icon={icons.regular.caretUp}
                                    color={sortState === COLUMN_SORT_STATE.DESC ? '#48AFF0' : ''}
                                />
                            </div>
                            <Icon
                                icon={icons.regular.caretDown}
                                color={sortState === COLUMN_SORT_STATE.ASC ? '#48AFF0' : ''}
                            />
                        </Flex>
                    )}
                </TableHeaderColumn>

                {filter && (
                    <TableColumnFilter
                        onClick={onFilterIconClick}
                        ref={filterRef}
                        tabIndex={-1}
                        hoverBackgroundColor={hoverBackgroundColor}
                        color={setFilters ? '#36A3FF' : undefined}
                    >
                        <Icon icon={icons.regular.filter} />
                    </TableColumnFilter>
                )}
            </Flex>
            {children.length > 0 && (
                <Flex
                    css={css`
                        border-top: 1px solid #cccccc;
                    `}
                >
                    {children.map((child) => (
                        <TableColumn
                            key={child.dataIndex}
                            columnKey={child.dataIndex}
                            text={child.title}
                            onClick={onClick}
                            onSortStateChange={onSortStateChange}
                            width={child.width ?? defaultChildWidthPercent}
                            children={child.children}
                            backgroundColor={backgroundColor}
                            hoverBackgroundColor={hoverBackgroundColor}
                        />
                    ))}
                </Flex>
            )}
        </TableHeaderColumnContainer>
    );
};

export default TableColumn;
