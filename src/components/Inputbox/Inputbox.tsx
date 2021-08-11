/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import clipboardCopy from 'clipboard-copy';
import { rgba } from 'polished';
import React, { Component, createRef } from 'react';
import {
    backgroundColor,
    ColorProps,
    margin,
    MarginProps,
    textColor,
    variant,
    VariantArgs,
    width,
    WidthProps,
} from '../../common';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import InputboxList from './InputboxList';

type InputboxSize = 'medium' | 'small' | 'xs' | 'sm' | 'md';

const inputboxSizeVariants: VariantArgs = {
    medium: css`
        font-size: 13px;
        padding: 11px 14px;
    `,
    small: css`
        font-size: 12px;
        padding: 7px 10px;
    `,
    xs: css`
        font-size: 12px;
        padding: 4px 6px;
    `,
};
inputboxSizeVariants.md = inputboxSizeVariants.medium;
inputboxSizeVariants.sm = inputboxSizeVariants.small;

interface InputboxContainerStypeProps {
    inline?: boolean;
}

const InputContainer = styled.div<InputboxContainerStypeProps & WidthProps & MarginProps>`
    display: inline-flex;
    flex-direction: column;
    position: relative;

    margin-right: 10px;
    margin-bottom: 10px;

    ${width}

    ${margin}

    ${(props) =>
        props.inline &&
        css`
            flex-direction: row;
        `}
`;

const inputboxLabelSizeVariants: VariantArgs = {
    medium: css`
        font-size: 13px;
    `,
    small: css`
        font-size: 12px;
    `,
    xs: css`
        font-size: 11px;
    `,
};
inputboxLabelSizeVariants.md = inputboxLabelSizeVariants.medium;
inputboxLabelSizeVariants.sm = inputboxLabelSizeVariants.small;

interface InputboxLabelContainerStypeProps {
    inline?: boolean;
    labelSize?: InputboxSize;
}

const InputboxLabelContainer = styled.div<InputboxLabelContainerStypeProps>`
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    ${(props) =>
        props.inline &&
        css`
            margin-bottom: 0;
            margin-right: 6px;
        `}

    ${variant<InputboxLabelContainerStypeProps>({
        prop: 'labelSize',
        variants: inputboxLabelSizeVariants,
    })}
`;

const InputboxLabel = styled.div`
    font-weight: bold;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

interface InputboxTextStyleProps extends ColorProps {
    drop?: boolean;
    componentSize: InputboxSize;
}

const InputboxText = styled.input<InputboxTextStyleProps>`
    width: 100%;
    box-sizing: border-box;

    margin: 0;
    outline: 0;

    border-radius: 5px;

    ${variant<InputboxTextStyleProps>({
        prop: 'componentSize',
        variants: inputboxSizeVariants,
    })}

    border: ${(props) => (props.drop ? '1px dashed #48AFF0' : '1px solid #ddd')};

    ${textColor}

    ${(props) => (props.drop ? { backgroundColor: rgba('#48AFF0', 0.3) } : backgroundColor(props))};
`;

const InputboxTextContainer = styled.div`
    position: relative;
    width: 100%;
`;

const IconRight = styled(Icon)`
    position: absolute;
    top: 1px;
    right: 1px;
    padding: 10px;

    cursor: pointer;

    float: right;
    z-index: 2;
`;

export interface InputboxProps extends WidthProps, MarginProps, ColorProps {
    label?: string;
    type?: string;
    defaultValue?: string;
    readOnly?: boolean;
    copy?: boolean;
    args?: unknown[];
    allowDrop?: boolean;
    showList?: boolean;
    listItems?: string[];
    onValueChange?: (value: string, ...args: any[]) => void;
    onListItemClick?: (value: string, ...args: any[]) => void;
    onCopied?: (copiedValue: string) => void;
    listItemClickArgs?: any[];
    min?: number;
    max?: number;
    inline?: boolean;
    size: InputboxSize;
}

interface States {
    inputValue: string;
    isShowList: boolean;
}

class Inputbox extends Component<InputboxProps, States> {
    private inputRef = createRef<HTMLInputElement>();

    static defaultProps = {
        size: 'medium',
    };

    constructor(props: InputboxProps) {
        super(props);

        this.state = {
            isShowList: false,
            inputValue: props.defaultValue || '',
        };
    }

    shouldComponentUpdate(nextProps: InputboxProps, nextState: States) {
        return (
            this.props.label !== nextProps.label ||
            this.props.type !== nextProps.type ||
            this.props.defaultValue !== nextProps.defaultValue ||
            this.props.readOnly !== nextProps.readOnly ||
            this.props.allowDrop !== nextProps.allowDrop ||
            JSON.stringify(this.props.args) !== JSON.stringify(nextProps.args) ||
            this.props.onValueChange !== nextProps.onValueChange ||
            this.props.onCopied !== nextProps.onCopied ||
            this.props.onListItemClick !== nextProps.onListItemClick ||
            JSON.stringify(this.props.backgroundColor) !== JSON.stringify(nextProps.backgroundColor) ||
            JSON.stringify(this.props.textColor) !== JSON.stringify(nextProps.textColor) ||
            this.props.copy !== nextProps.copy ||
            this.props.min !== nextProps.min ||
            this.props.max !== nextProps.max ||
            this.props.width !== nextProps.width ||
            JSON.stringify(this.props.listItems) !== JSON.stringify(nextProps.listItems) ||
            JSON.stringify(this.state) !== JSON.stringify(nextState) ||
            this.props.inline !== nextProps.inline ||
            this.props.size !== nextProps.size
        );
    }

    componentDidUpdate(prevProps: InputboxProps, _: States) {
        if (prevProps.defaultValue !== this.props.defaultValue) {
            this.setState({
                inputValue: this.props.defaultValue || this.state.inputValue,
            });
        }
    }

    onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.value;
        if (this.props.onValueChange) {
            if (this.props.args) {
                this.props.onValueChange(value, ...this.props.args);
            } else {
                this.props.onValueChange(value);
            }
        }
        this.setState({ inputValue: value });
    };

    onCopy = async () => {
        if (this.inputRef && this.inputRef.current) {
            await clipboardCopy(this.inputRef.current.value);
            this.props.onCopied?.(this.inputRef.current.value);
        }
    };

    onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('data');
        (e.currentTarget as HTMLInputElement).value = data;
        if (this.props.onValueChange) {
            if (this.props.args) {
                this.props.onValueChange(data, ...this.props.args);
            } else {
                this.props.onValueChange(data);
            }
        }
    };

    onInputFocus = () => {
        if (this.props.showList) {
            this.setState({ isShowList: true });
        }
    };

    onInputBlur = () => {
        if (this.props.showList) {
            this.setState({ isShowList: false });
        }
    };

    render() {
        const {
            label,
            type,
            defaultValue,
            onValueChange,
            readOnly,
            copy,
            args,
            allowDrop,
            showList,
            listItems,
            onListItemClick,
            listItemClickArgs,
            min,
            max,
            backgroundColor = 'transparent',
            textColor,
            onCopied,
            inline,
            size,
            ...props
        } = this.props;
        const { isShowList, inputValue } = this.state;

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Inputbox]', 'Rendered');
            console.log({
                label,
                type,
                defaultValue,
                onValueChange,
                readOnly,
                copy,
                args,
                allowDrop,
                showList,
                listItems,
                onListItemClick,
                listItemClickArgs,
                min,
                max,
                backgroundColor,
                textColor,
                onCopied,
                inline,
                size,
                ...props,
            });
            console.groupEnd();
        }

        const onAllowDrop = (e: React.DragEvent) => {
            if (allowDrop) {
                e.preventDefault();
            }
        };

        return (
            <InputContainer inline={inline} {...props}>
                {label && (
                    <InputboxLabelContainer labelSize={size} title={label} inline={inline}>
                        <InputboxLabel>{label}</InputboxLabel>
                    </InputboxLabelContainer>
                )}
                <InputboxTextContainer>
                    {copy && <IconRight onClick={this.onCopy} icon={icons.regular.copy} />}
                    {
                        <InputboxText
                            aria-label={label ?? 'inputbox'}
                            disabled={readOnly}
                            type={type ?? 'text'}
                            value={inputValue}
                            onChange={this.onInputChange}
                            ref={this.inputRef}
                            onDragOver={onAllowDrop}
                            onDrop={allowDrop ? this.onDrop : undefined}
                            onFocus={this.onInputFocus}
                            onBlur={this.onInputBlur}
                            drop={allowDrop}
                            min={min}
                            max={max}
                            textColor={textColor}
                            backgroundColor={backgroundColor}
                            componentSize={size}
                        />
                    }
                    {isShowList && (
                        <InputboxList
                            maxHeight={200}
                            items={listItems ? listItems : []}
                            onClick={onListItemClick}
                            clickArgs={listItemClickArgs}
                        />
                    )}
                </InputboxTextContainer>
            </InputContainer>
        );
    }
}

export default Inputbox;
