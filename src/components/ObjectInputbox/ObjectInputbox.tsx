/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Component, createRef } from 'react';
import { RadioChangeEvent } from '../../types/radio';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import Radio from '../Radio/Radio';
import RadioGroup from '../Radio/RadioGroup';
import ArrayInput from './ArrayInput';
import JsonInput from './JsonInput';

const InputContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    position: relative;
`;

const InputBoxLabel = styled.div`
    display: flex;
    align-items: center;

    font-size: 12px;
    font-weight: bold;

    margin-bottom: 6px;
`;

const InputBoxTextContainer = styled.div`
    position: relative;
`;

const TextareaJsonRaw = styled.textarea`
    width: 100%;
    box-sizing: border-box;

    padding: 9px 14px;
    margin: 0;
    outline: 0;

    font-size: 13px;

    border-radius: 5px;
    border: 1px solid #ddd;

    resize: vertical;
`;

export interface ObjectInputboxProps {
    label?: string;
    value?: string;
    additionalOnValueChangeArgs?: any[];
    allowDrop?: boolean;
    showList?: boolean;
    listItems?: string[];
    onValueChange?: (value: string, ...args: any[]) => void;
    onListItemClick?: (value: string, ...args: any[]) => void;
    additionalonListItemClickArgs?: any[];
}

interface Json {
    key: string;
    value: string;
}

interface States {
    jsonType: string;
    jsonValueCount: number;
    arrayValueCount: number;
    jsonRawValue: string;
    jsonValue: Json[];
    jsonArray: string[];
}

class ObjectInputbox extends Component<ObjectInputboxProps, States> {
    private inputRef = createRef<HTMLInputElement>();

    constructor(props: ObjectInputboxProps) {
        super(props);

        this.state = {
            jsonType: 'raw',
            jsonValueCount: 1,
            arrayValueCount: 1,
            jsonRawValue: '',
            jsonValue: [],
            jsonArray: [''],
        };
    }

    shouldComponentUpdate(nextProps: ObjectInputboxProps, nextState: States) {
        return (
            this.props.label !== nextProps.label ||
            this.props.value !== nextProps.value ||
            this.props.allowDrop !== nextProps.allowDrop ||
            JSON.stringify(this.props.additionalOnValueChangeArgs) !==
                JSON.stringify(nextProps.additionalOnValueChangeArgs) ||
            this.props.onValueChange !== nextProps.onValueChange ||
            JSON.stringify(this.state) !== JSON.stringify(nextState) ||
            this.props.onListItemClick !== nextProps.onListItemClick
        );
    }

    onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.value;

        try {
            const json = JSON.parse(value) as Record<string, number | string | Record<string, unknown>>;
            if (Array.isArray(json)) {
                this.setState({
                    jsonArray: json,
                });
            } else {
                const jsonValue: Json[] = [];
                let count = 0;
                for (const key of Object.keys(json)) {
                    jsonValue.push({
                        key,
                        value: json[key].toString(),
                    });
                    count++;
                }
                this.setState({
                    jsonValue,
                    jsonValueCount: count,
                });
            }
        } catch (e) {
            console.log(e);
        }

        this.setState({
            jsonRawValue: value,
        });
        if (this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(value, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(value);
            }
        }
    };

    onJsonTypeChange = (e: RadioChangeEvent) => {
        const type = e.target.value;
        let rawString = this.state.jsonRawValue;
        if (type === 'json') {
            const rawJson: Record<string, unknown> = {};
            for (const data of this.state.jsonValue) {
                rawJson[data.key] = data.value;
            }
            rawString = JSON.stringify(rawJson);
        } else if (type === 'array') {
            rawString = JSON.stringify(this.state.jsonArray);
        }

        if (this.state.jsonRawValue !== rawString && this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(rawString);
            }
        }
        this.setState({
            jsonRawValue: rawString,
            jsonType: e.target.value?.toString() ?? 'raw',
        });
    };

    onJsonKeyValueChange = (key: string, value: string, index: number) => {
        const jsonValue = [...this.state.jsonValue];
        jsonValue[index] = { key, value };

        const rawJson: Record<string, unknown> = {};
        for (const data of jsonValue) {
            rawJson[data.key] = data.value;
        }
        const rawString = JSON.stringify(rawJson);

        if (this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(rawString);
            }
        }

        this.setState({ jsonValue, jsonRawValue: rawString });
    };

    onArrayValueChange = (index: number, value: string) => {
        const jsonArray = this.state.jsonArray;
        jsonArray[index] = value;

        const rawString = JSON.stringify(jsonArray);

        if (this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(rawString);
            }
        }

        this.setState({ jsonArray: [...jsonArray], jsonRawValue: rawString });
    };

    onIncreaseJsonElement = () => {
        this.setState({ jsonValueCount: this.state.jsonValueCount + 1 });
    };

    onRemoveJsonElement = (index: number) => {
        if (this.state.jsonValueCount > 0) {
            const jsonValue = [...this.state.jsonValue];
            jsonValue.splice(index, 1);

            const rawJson: Record<string, unknown> = {};
            for (const data of jsonValue) {
                rawJson[data.key] = data.value;
            }
            const rawString = JSON.stringify(rawJson);

            if (this.props.onValueChange) {
                if (this.props.additionalOnValueChangeArgs) {
                    this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
                } else {
                    this.props.onValueChange(rawString);
                }
            }

            this.setState({
                jsonValue,
                jsonRawValue: rawString,
                jsonValueCount: this.state.jsonValueCount - 1,
            });
        }
    };

    onIncreaseArrayElement = () => {
        const jsonArray = [...this.state.jsonArray];
        jsonArray.push('');

        const rawString = JSON.stringify(jsonArray);

        if (this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(rawString);
            }
        }

        this.setState({
            jsonArray,
            arrayValueCount: this.state.arrayValueCount + 1,
            jsonRawValue: rawString,
        });
    };

    onRemoveArrayElement = (index: number) => {
        if (this.state.arrayValueCount > 0) {
            const jsonArray = [...this.state.jsonArray];
            jsonArray.splice(index, 1);

            const rawString = JSON.stringify(jsonArray);

            if (this.props.onValueChange) {
                if (this.props.additionalOnValueChangeArgs) {
                    this.props.onValueChange(rawString, ...this.props.additionalOnValueChangeArgs);
                } else {
                    this.props.onValueChange(rawString);
                }
            }

            this.setState({
                jsonArray,
                jsonRawValue: rawString,
                arrayValueCount: this.state.arrayValueCount - 1,
            });
        }
    };

    onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('data');
        (e.currentTarget as HTMLInputElement).value = data;
        if (this.props.onValueChange) {
            if (this.props.additionalOnValueChangeArgs) {
                this.props.onValueChange(data, ...this.props.additionalOnValueChangeArgs);
            } else {
                this.props.onValueChange(data);
            }
        }
    };

    onAllowDrop = (e: React.DragEvent) => {
        if (this.props.allowDrop) {
            e.preventDefault();
        }
    };

    render() {
        const { label, allowDrop, ...props } = this.props;
        const { jsonType, jsonValueCount, arrayValueCount, jsonRawValue, jsonValue, jsonArray } = this.state;

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[ObjectInputbox]', 'Rendered');
            console.log({
                label,
                allowDrop,
                ...props,
            });
            console.groupEnd();
        }

        const jsonElements = [];
        const savedJsonKeyValue: Array<string[]> = [];
        for (const data of jsonValue) {
            savedJsonKeyValue.push([data.key, data.value]);
        }

        for (let i = 0; i < jsonValueCount; i++) {
            let key = '';
            let value = '';
            if (savedJsonKeyValue.length > 0) {
                const el = savedJsonKeyValue.shift();
                if (el) {
                    key = el[0];
                    value = el[1];
                }
            }
            jsonElements.push(
                <JsonInput
                    key={i}
                    inputKey={key}
                    inputValue={value}
                    index={i}
                    onJsonChange={this.onJsonKeyValueChange}
                    onRemove={this.onRemoveJsonElement}
                    allowDrop={allowDrop}
                />
            );
        }

        const arrayElements = [];
        for (let i = 0; i < arrayValueCount; i++) {
            arrayElements.push(
                <ArrayInput
                    key={i}
                    inputIndex={i}
                    inputValue={jsonArray[i]}
                    onRemove={this.onRemoveArrayElement}
                    onValueChange={this.onArrayValueChange}
                    allowDrop={allowDrop}
                />
            );
        }

        return (
            <InputContainer>
                <InputBoxLabel>
                    <div>{label}</div>
                    <div
                        css={css`
                            display: inline-flex;
                            align-items: center;
                        `}
                    >
                        <RadioGroup name="type" onChange={this.onJsonTypeChange}>
                            <Radio value="raw" defaultChecked>
                                Raw
                            </Radio>
                            <Radio value="json">
                                {jsonType !== 'json' ? (
                                    'Json'
                                ) : (
                                    <div>
                                        <Button
                                            width="15px"
                                            // height="20px"
                                            size="small"
                                            textColor="white"
                                            backgroundColor="#0F9960"
                                            hoverBackgroundColor="#3DCC91"
                                            onClick={this.onIncreaseJsonElement}
                                            title="Add json key"
                                        >
                                            <Icon size="sm" icon={icons.regular.plus} />
                                        </Button>
                                    </div>
                                )}
                            </Radio>
                            <Radio value="array">
                                {jsonType !== 'array' ? (
                                    'Array'
                                ) : (
                                    <div>
                                        <Button
                                            width="15px"
                                            // height="20px"
                                            size="small"
                                            textColor="white"
                                            backgroundColor="#0F9960"
                                            hoverBackgroundColor="#3DCC91"
                                            onClick={this.onIncreaseArrayElement}
                                            title="Add array value"
                                        >
                                            <Icon size="sm" icon={icons.regular.plus} />
                                        </Button>
                                    </div>
                                )}
                            </Radio>
                        </RadioGroup>
                    </div>
                </InputBoxLabel>
                <InputBoxTextContainer>
                    {jsonType === 'raw' && (
                        <TextareaJsonRaw
                            aria-label={label ?? 'object-inputbox'}
                            rows={3}
                            value={jsonRawValue}
                            onChange={this.onInputChange}
                            onDrop={this.onAllowDrop}
                        />
                    )}
                    {jsonType === 'json' && [...jsonElements]}
                    {jsonType === 'array' && [...arrayElements]}
                </InputBoxTextContainer>
            </InputContainer>
        );
    }
}

export default ObjectInputbox;
