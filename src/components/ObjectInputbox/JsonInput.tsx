import styled from '@emotion/styled';
import { rgba } from 'polished';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { width, WidthProps } from '../../common';
import { Flex } from '../../base';
import Button from '../Button/Button';
import icons from '../Icon/icons';
import Icon from '../Icon/Icon';

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
    ${InputBoxText}:first-child input {
        border-top-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 0;
    }

    ${InputBoxText}:nth-child(2) input {
        border-left: 0;

        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
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
    inputKey: string;
    inputValue: string;
    index: number;
    allowDrop?: boolean;
    onJsonChange?: (key: string, value: string, index: number, isKeyChanged: boolean) => void;
    onRemove?: (index: number) => void;
}

const JsonInput: React.FC<Props> = memo(
    ({ inputKey, inputValue, index, allowDrop, onJsonChange, onRemove }) => {
        const [jsonKey, setJsonKey] = useState(inputKey);
        const [jsonValue, setJsonValue] = useState(inputValue);

        const onKeyChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const changedKey = e.currentTarget.value;
                if (jsonKey !== changedKey && onJsonChange) {
                    onJsonChange(changedKey, jsonValue, index, true);
                }
                setJsonKey(changedKey);
            },
            [index, jsonKey, jsonValue, onJsonChange]
        );

        const onValueChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const changedValue = e.currentTarget.value;
                if (jsonValue !== changedValue && onJsonChange) {
                    onJsonChange(jsonKey, changedValue, index, false);
                }
                setJsonValue(changedValue);
            },
            [index, jsonKey, jsonValue, onJsonChange]
        );

        const onRemoveKey = useCallback(() => {
            if (onRemove) {
                onRemove(index);
            }
        }, [index, onRemove]);

        const onValueDrop = useCallback(
            (e: React.DragEvent) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('data');
                (e.currentTarget as HTMLInputElement).value = data;
                if (jsonValue !== data && onJsonChange) {
                    onJsonChange(jsonKey, data, index, false);
                }
                setJsonValue(data);
            },
            [index, jsonKey, jsonValue, onJsonChange]
        );

        const onAllowDrop = (e: React.DragEvent) => {
            if (allowDrop) {
                e.preventDefault();
            }
        };

        useEffect(() => {
            setJsonKey(inputKey);
            setJsonValue(inputValue);
        }, [inputKey, inputValue]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[JsonInput]', 'Rendered', inputKey);
            console.log({
                inputValue,
                index,
                allowDrop,
                onJsonChange,
                onRemove,
            });
            console.groupEnd();
        }

        return (
            <InputBoxTextContainer width="100%">
                <Flex>
                    <InputBoxText width={0.45}>
                        <input type="text" placeholder="key" onChange={onKeyChange} value={jsonKey}></input>
                    </InputBoxText>
                    <InputBoxText width={0.45} drop={allowDrop}>
                        <input
                            type="text"
                            placeholder="value"
                            onChange={onValueChange}
                            value={jsonValue}
                            onDragOver={onAllowDrop}
                            onDrop={onValueDrop}
                        ></input>
                    </InputBoxText>
                    <Button
                        width={0.1}
                        size="small"
                        textColor="white"
                        backgroundColor="#D34534"
                        hoverBackgroundColor="#FD5329"
                        onClick={onRemoveKey}
                    >
                        <Icon size="sm" icon={icons.regular.minus} />
                    </Button>
                </Flex>
            </InputBoxTextContainer>
        );
    },
    (prevProps: Props, nextProps: Props) =>
        prevProps.inputKey === nextProps.inputKey &&
        prevProps.inputValue === nextProps.inputValue &&
        prevProps.allowDrop === nextProps.allowDrop
);

export default JsonInput;
