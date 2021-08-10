/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { backgroundColor, BackgroundColorProps, cssLength, Length } from '../../common';
import { Flex } from '../../base';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';

const FilterListContainer = styled.div<BackgroundColorProps>`
    display: flex;
    position: absolute;
    padding: 10px;
    flex-direction: column;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 2;
    transform: translateX(-100%);

    ${backgroundColor};
`;

interface TableColumnFilterProps {
    columnDataIndex: string;
    left: number;
    top: number;
    data: string[];
    checks?: { [key: string]: boolean };
    onFilterChange?: (columnDataIndex: string, filters: string[]) => void;
    textColor?: string;
    backgroundColor?: string;
    maxHeight?: Length;
}

const TableColumnFilter: React.FC<TableColumnFilterProps> = ({
    columnDataIndex,
    left,
    top,
    data,
    checks = {},
    onFilterChange,
    textColor,
    backgroundColor,
    maxHeight,
}) => {
    const initCheckStates = useMemo(() => {
        const next: { [key: string]: boolean } = {};
        data.forEach((content) => {
            next[content] = checks?.[content];
        });
        return next;
    }, [data, checks]);

    const [checkStates, setCheckStates] = useState<{ [key: string]: boolean }>(initCheckStates);
    const onCheckChange = (value: string, checked: boolean) => {
        setCheckStates((s) => ({ ...s, [value]: checked }));
    };

    const onAllCheck = useCallback(() => {
        const nextCheckStates: { [key: string]: boolean } = {};
        data.forEach((content) => {
            nextCheckStates[content] = true;
        });
        setCheckStates(nextCheckStates);
    }, [data]);

    const onReset = useCallback(() => {
        const nextCheckStates: { [key: string]: boolean } = {};
        data.forEach((content) => {
            nextCheckStates[content] = false;
        });
        setCheckStates(nextCheckStates);
    }, [data]);

    const onOK = useCallback(() => {
        const checkedFilters: string[] = [];
        for (const filter in checkStates) {
            if (checkStates[filter]) {
                checkedFilters.push(filter);
            }
        }
        onFilterChange?.(columnDataIndex, checkedFilters);
    }, [columnDataIndex, checkStates, onFilterChange]);

    const displayData = useMemo(() => {
        const sortedData = [...data];
        sortedData.sort((a, b) => {
            return a.localeCompare(b);
        });
        return sortedData;
    }, [data]);

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[TableColumnFilter]', 'Rendered');
        console.log({
            columnDataIndex,
            left,
            top,
            data,
            checks,
            onFilterChange,
            textColor,
            backgroundColor,
            maxHeight,
        });
        console.groupEnd();
    }

    return createPortal(
        <FilterListContainer
            css={css`
                left: ${`${left}px`};
                top: ${`${top}px`};
            `}
            backgroundColor={backgroundColor}
        >
            <Flex flexDirection="row" justifyContent="space-between">
                <Button onClick={onAllCheck}>All</Button>
                <Button onClick={onReset}>Reset</Button>
            </Flex>
            <div
                css={css`
                    margin: 5px 0;
                    max-height: ${cssLength(maxHeight)};
                    overflow: auto;
                `}
            >
                {displayData.map((content) => {
                    return (
                        <div
                            key={content}
                            css={css`
                                padding: 4px;
                            `}
                        >
                            <Checkbox
                                value={content}
                                checked={!!checkStates[content]}
                                onChange={onCheckChange}
                                textColor={textColor}
                            />
                        </div>
                    );
                })}
            </div>{' '}
            <Button onClick={onOK}>OK</Button>
        </FilterListContainer>,
        document.body
    );
};

export default TableColumnFilter;
