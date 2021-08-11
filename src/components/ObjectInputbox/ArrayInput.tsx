import styled from '@emotion/styled';
import { rgba } from 'polished';
import React, { useCallback, useEffect, useState } from 'react';
import { width, WidthProps } from '../../common';
import { Flex } from '../../base';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';

interface InputBoxTextStyleProps {
    drop?: boolean;
}

const InputBoxText = styled.div<InputBoxTextStyleProps & WidthProps>`
    ${width}
    input {
        width: 100%;
        box-sizing: border-box;

        padding: 9px 14px;
        margin: 0;
        outline: 0;

        font-size: 13px;

        border-radius: 5px;
        border: ${(props) => (props.drop ? '1px dashed #48AFF0' : '1px solid #ddd')};
        background-color: ${(props) => (props.drop ? rgba('#48AFF0', 0.3) : '')};
    }
`;

const InputBoxTextContainer = styled.div<WidthProps>`
    ${width}
    ${InputBoxText}:first-child input {
        border-top-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 0;
    }

    div {
        border-left: 0;

        border-top-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 5px;
    }
`;

interface Props {
    inputIndex: number;
    inputValue: string;
    allowDrop?: boolean;
    onValueChange?: (index: number, value: string) => void;
    onRemove?: (index: number) => void;
}

const ArrayInput: React.FC<Props> = ({ inputIndex, inputValue, allowDrop, onValueChange, onRemove }) => {
    const [arrayValue, setArrayValue] = useState(inputValue);

    const onArrayValueChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const changedValue = e.currentTarget.value;
            if (arrayValue !== changedValue && onValueChange) {
                onValueChange(inputIndex, changedValue);
            }
            setArrayValue(changedValue);
        },
        [inputIndex, arrayValue, onValueChange]
    );

    const onRemoveIndex = useCallback(() => {
        if (onRemove) {
            onRemove(inputIndex);
        }
    }, [onRemove, inputIndex]);

    const onValueDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('data');
            (e.currentTarget as HTMLInputElement).value = data;
            if (arrayValue !== data && onValueChange) {
                onValueChange(inputIndex, data);
            }
            setArrayValue(data);
        },
        [inputIndex, arrayValue, onValueChange]
    );

    const onAllowDrop = (e: React.DragEvent) => {
        if (allowDrop) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        setArrayValue(inputValue);
    }, [inputValue]);

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[ArrayInput]', 'Rendered', inputIndex);
        console.log({
            inputIndex,
            inputValue,
            allowDrop,
            onValueChange,
            onRemove,
        });
        console.groupEnd();
    }

    return (
        <InputBoxTextContainer width={1}>
            <Flex>
                <InputBoxText width={0.85} drop={allowDrop}>
                    <input
                        type="text"
                        placeholder="value"
                        value={arrayValue}
                        onChange={onArrayValueChange}
                        onDrop={onValueDrop}
                        onDragOver={onAllowDrop}
                    />
                </InputBoxText>
                <Button
                    width={0.15}
                    size="small"
                    textColor="white"
                    backgroundColor="#D34534"
                    hoverBackgroundColor="#FD5329"
                    onClick={onRemoveIndex}
                >
                    <Icon size="sm" icon={icons.regular.minus} />
                </Button>
            </Flex>
        </InputBoxTextContainer>
    );
};

export default ArrayInput;
