import React, { useCallback } from 'react';
import styled from '@emotion/styled';

interface InputListContainerStyleProps {
    maxHeight: number;
}

const InputboxListContainer = styled.div<InputListContainerStyleProps>`
    position: absolute;
    top: 100%;
    left: 0;

    width: 100%;
    max-height: ${(props) => `${props.maxHeight}px`};

    overflow-x: hidden;
    overflow-y: auto;

    font-size: 13px;

    padding: 0;
    margin: 0;

    z-index: 3;

    background-color: white;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
`;

const InputboxListItem = styled.div`
    padding: 8px;
    cursor: pointer;

    &:hover {
        background-color: #f2f2f2;
    }
`;

interface InputboxListProps {
    maxHeight: number;
    items: string[];
    onClick?: (item: string, ...args: any[]) => void;
    clickArgs?: any[];
}

const InputboxList: React.FC<InputboxListProps> = ({ maxHeight, items, onClick, clickArgs }) => {
    const onItemClick = useCallback(
        (item: string) => {
            if (onClick) {
                if (clickArgs) {
                    onClick(item, ...clickArgs);
                } else {
                    onClick(item);
                }
            }
        },
        [onClick, clickArgs]
    );

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[InputboxList]', 'Rendered');
        console.log({ maxHeight, items, onClick, clickArgs });
        console.groupEnd();
    }

    return (
        <InputboxListContainer role="listbox" aria-label="inputbox select list" maxHeight={maxHeight}>
            {items.length > 0 ? (
                items.map((item, index) => (
                    <InputboxListItem role="option" aria-label={item} key={index} onMouseDown={() => onItemClick(item)}>
                        {item}
                    </InputboxListItem>
                ))
            ) : (
                <div />
            )}
        </InputboxListContainer>
    );
};

export default InputboxList;
