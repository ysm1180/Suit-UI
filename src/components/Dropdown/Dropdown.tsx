/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import clipboardCopy from 'clipboard-copy';
import { getRegExp } from 'korean-regexp';
import { rgba } from 'polished';
import React, { Component, createRef } from 'react';
import {
    backgroundColor,
    BackgroundColorProps,
    color,
    ColorProps,
    Length,
    textColor,
    TextColorProps,
    variant,
    VariantArgs,
    width,
    WidthProps,
} from '../../common';
import { Flex } from '../../base';
import { Button, Tooltip } from '../../index';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import DropdownList from './DropdownList';
import { DropdownDarkTheme, DropdownDefaultTheme, DropdownLightTheme } from './theme';

type DropdownSize = 'md' | 'medium' | 'small' | 'sm' | 'xs';

interface DropdownContainerStyleProps {
    size: DropdownSize;
}

const containerSizeVariants: VariantArgs = {
    medium: css`
        margin-right: 10px;
        margin-bottom: 10px;
    `,
    small: css`
        margin-right: 5px;
        margin-bottom: 5px;
    `,
    xs: css`
        margin-right: 1px;
        margin-bottom: 1px;
    `,
};
containerSizeVariants.md = containerSizeVariants.medium;
containerSizeVariants.sm = containerSizeVariants.small;

const DropdownContainer = styled.div<DropdownContainerStyleProps & WidthProps>`
    ${variant<DropdownContainerStyleProps>({
        prop: 'size',
        variants: containerSizeVariants,
    })}

    ${width}
`;

const inputContainerSizeVariants: VariantArgs = {
    medium: css`
        font-size: 13px;
        padding: 11px 29px 11px 14px;
    `,
    small: css`
        font-size: 13px;
        padding: 6px 29px 8px 11px;
    `,
    xs: css`
        font-size: 11px;
        padding: 3px 29px 5px 11px;
    `,
};
inputContainerSizeVariants.md = inputContainerSizeVariants.medium;
inputContainerSizeVariants.sm = inputContainerSizeVariants.small;

interface DropdownInputContainerStyleProps {
    borderColor?: string;
    disabled?: boolean;
    size: DropdownSize;
}

const DropdownInputContainer = styled.div<DropdownInputContainerStyleProps & BackgroundColorProps>`
    position: relative;
    flex: 1;
    border-radius: 5px;
    min-height: 17px;

    ${variant<DropdownInputContainerStyleProps>({
        prop: 'size',
        variants: inputContainerSizeVariants,
    })}

    ${backgroundColor}

    border: ${(props) => `1px solid ${rgba(props.borderColor ?? '#222426', 0.15)}`};

    &:hover {
        border: ${(props) => (!props.disabled ? `1px solid ${rgba(props.borderColor ?? '#222426', 0.35)}` : '')};
    }

    ${(props) =>
        props.disabled &&
        css`
            background-color: #f5f5f5;
        `}
`;

const DropdownLabel = styled.div<TextColorProps>`
    font-size: 12px;
    font-weight: bold;

    margin-bottom: 6px;

    ${textColor}
`;

const inputSizeVariants: VariantArgs = {
    medium: css`
        font-size: 12px;
        padding: 14px 29px 11px 13px;
    `,
    small: css`
        font-size: 12px;
        padding: 9px 29px 8px 10px;
    `,
    xs: css`
        font-size: 12px;
        padding: 6px 29px 5px 10px;
    `,
};
inputSizeVariants.md = inputSizeVariants.medium;
inputSizeVariants.sm = inputSizeVariants.small;

interface DropdownInputStyleProps {
    componentsize: DropdownSize;
}

const DropdownInput = styled.input<DropdownInputStyleProps & ColorProps>`
    position: absolute;
    left: 1px;
    top: 0;

    background: none transparent;
    border: none;

    width: 100%;
    outline: 0;
    border: 0;

    box-sizing: border-box;

    ${variant<DropdownInputStyleProps>({
        prop: 'componentsize',
        variants: inputSizeVariants,
    })}

    ${color}
`;

const iconSizeVariants: VariantArgs = {
    medium: css`
        padding: 10px 0;
    `,
    small: css`
        padding: 7px 0;
    `,
    xs: css`
        padding: 5px 0;
    `,
};
iconSizeVariants.md = iconSizeVariants.medium;
iconSizeVariants.sm = iconSizeVariants.small;

interface IconStyleProps {
    componentsize: DropdownSize;
    disabled?: boolean;
}

const CustomIcon = styled(Icon)<IconStyleProps>`
    ${variant<IconStyleProps>({
        prop: 'componentsize',
        variants: iconSizeVariants,
    })}

    ${(props) =>
        props.disabled &&
        css`
            color: #c7c7c7;
        `}
`;

interface ItemObject {
    label: string;
    value: string;
}

export interface DropdownKeyboardEvent {
    key: string;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    code: string;
    nativeEvent: KeyboardEvent;
}

type DropdownItemType = string | number | ItemObject;
export type DropdownItems = DropdownItemType[];

export interface DropdownInnerProps {
    items?: DropdownItemType[];
    maxItemsHeight?: Length;
    label?: string;
    onValueChange?: (item: string) => void;
    onKeyDown?: (e: DropdownKeyboardEvent) => void;
    value?: string | number;
    theme?: DropdownDefaultTheme;
    dark?: boolean;
    size: DropdownSize;
    disable?: boolean;
    loading?: boolean;
    copy?: boolean;
    copyTooltip?: string;
}

interface States {
    focusedInput: boolean;
    inputItem: { label: string; value: string | number };
    filters: (string | RegExp)[];
    changingInput: boolean;
    currentTheme: DropdownDefaultTheme;
    copyButtonRef: HTMLButtonElement | null;
}

export type DropdownProps = DropdownInnerProps & WidthProps & BackgroundColorProps;

class Dropdown extends Component<DropdownProps, States> {
    static defaultProps = {
        items: [],
        label: '',
        value: '',
        dark: false,
        theme: undefined,
        maxItemsHeight: undefined,
        size: 'medium',
    };

    private dropdownInputRef = createRef<HTMLInputElement>();
    private dropdownList = createRef<DropdownList>();
    private keyEvent: (e: KeyboardEvent) => void;

    constructor(props: DropdownProps) {
        super(props);

        let initLabel = '';
        let initValue = '';
        if (this.props.items && this.props.items.length > 0) {
            const foundItem =
                this.props.items.find((item) =>
                    this.isItemObject(item) ? item.value === this.props.value : item === this.props.value
                ) ?? '';
            if (this.isItemObject(foundItem)) {
                initLabel = foundItem.label;
                initValue = foundItem.value;
            } else {
                initLabel = `${foundItem}`;
                initValue = `${foundItem}`;
            }
        }

        this.state = {
            focusedInput: false,
            inputItem: { label: initLabel, value: initValue },
            filters: [],
            changingInput: false,
            currentTheme: props.theme ?? (props.dark ? DropdownDarkTheme : DropdownLightTheme),
            copyButtonRef: null,
        };
        this.keyEvent = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.onBlurInput();
            }
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyEvent);
    }

    shouldComponentUpdate(nextProps: DropdownProps, nextState: States) {
        return (
            JSON.stringify(nextProps.items) !== JSON.stringify(this.props.items) ||
            nextState.focusedInput !== this.state.focusedInput ||
            this.props.label !== nextProps.label ||
            this.props.value !== nextProps.value ||
            this.props.dark !== nextProps.dark ||
            this.props.disable !== nextProps.disable ||
            this.props.loading !== nextProps.loading ||
            this.props.size !== nextProps.size ||
            this.props.backgroundColor !== nextProps.backgroundColor ||
            this.props.width !== nextProps.width ||
            this.props.copy !== nextProps.copy ||
            this.props.copyTooltip !== nextProps.copyTooltip ||
            JSON.stringify(this.props.width) !== JSON.stringify(nextProps.width) ||
            this.props.onValueChange !== nextProps.onValueChange ||
            this.props.onKeyDown !== nextProps.onKeyDown ||
            JSON.stringify(this.props.theme) !== JSON.stringify(nextProps.theme) ||
            nextState.filters !== this.state.filters ||
            this.state.inputItem !== nextState.inputItem ||
            JSON.stringify(this.state.currentTheme) !== JSON.stringify(nextState.currentTheme) ||
            this.state.copyButtonRef !== nextState.copyButtonRef
        );
    }

    isNumber(x: unknown): x is number {
        return typeof x === 'number';
    }

    isString(x: unknown): x is string {
        return typeof x === 'string';
    }

    isItemObject(obj: ItemObject | string | number): obj is ItemObject {
        return (obj as ItemObject).label !== undefined && (obj as ItemObject).value !== undefined;
    }

    componentDidUpdate(prevProps: DropdownProps, prevState: States) {
        const items = this.props.items!;
        if (JSON.stringify(prevProps.items) !== JSON.stringify(items) || prevProps.value !== this.props.value) {
            let initLabel = '';
            let initValue: string | number = '';
            if (items.length > 0) {
                const foundItem =
                    items.find((item) =>
                        this.isItemObject(item) ? item.value === this.props.value : item === this.props.value
                    ) ?? '';
                if (this.isItemObject(foundItem)) {
                    initLabel = foundItem.label;
                    initValue = foundItem.value;
                } else {
                    initLabel = `${foundItem}`;
                    initValue = foundItem;
                }
            }

            let label = initLabel;
            let value = this.props.value || initValue;
            const inputItem = items.find((item) => {
                if (typeof item === 'object') {
                    return item.label === label;
                } else {
                    return `${item}` === label;
                }
            });
            const selectedItem = this.dropdownList?.current?.getCurrentItem();
            let change = false;
            if (!inputItem) {
                change = true;
            } else if (inputItem && selectedItem) {
                if (typeof inputItem === 'object') {
                    if (inputItem.value !== selectedItem.value) {
                        change = true;
                    }
                } else {
                    if (`${inputItem}` !== selectedItem.value) {
                        change = true;
                    }
                }
            }
            if (change) {
                label = selectedItem?.label || initLabel;
                value = selectedItem?.value || initValue;
            }

            this.setState({
                inputItem: { label, value },
            });
            if (this.state.inputItem.value !== value) {
                this.props.onValueChange?.(`${value}`);
            }
            this.onBlurInput();
        }

        if (prevProps.dark !== this.props.dark) {
            this.setState({
                currentTheme: this.props.theme ?? this.props.dark ? DropdownDarkTheme : DropdownLightTheme,
            });
        }
    }

    onBlurInput = () => {
        if (this.dropdownInputRef && this.dropdownInputRef.current) {
            this.dropdownInputRef.current.value = '';
        }

        this.setState({
            filters: [],
            focusedInput: false,
            changingInput: false,
        });
    };

    onClick = (e: React.MouseEvent, label: string, value: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.state.inputItem.value !== value) {
            this.props.onValueChange?.(value);
        }
        this.onBlurInput();
        this.setState({
            inputItem: {
                label,
                value,
            },
        });
    };

    onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (value === '') {
            this.setState({
                focusedInput: true,
                changingInput: false,
                filters: [],
            });
        } else {
            const chars = value.split('');
            const filters = [];

            let appliedFilter = '(.*)';
            for (const char of chars) {
                appliedFilter += `([${char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}])(.*)`;
            }

            filters.push(appliedFilter);
            filters.push(getRegExp(value));

            this.setState({
                focusedInput: true,
                changingInput: true,
                filters: filters,
            });
        }
    };

    onSelectItem = (label: string) => {
        const inputItem = this.state.inputItem;
        const selectedItem = this.dropdownList?.current?.getCurrentItem();
        if (!selectedItem) {
            return;
        }

        let value = '';
        let change = false;
        if (!inputItem) {
            change = true;
        } else if (inputItem && selectedItem) {
            if (inputItem.value !== selectedItem.value) {
                change = true;
            }
        }
        if (change) {
            label = selectedItem?.label || '';
            value = selectedItem?.value || '';
        }

        if (label && value) {
            if (this.state.inputItem.value !== value) {
                this.props.onValueChange?.(value);
            }

            this.setState({
                inputItem: {
                    label,
                    value,
                },
                filters: [],
            });
        }
        this.onBlurInput();
    };

    onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Enter') {
                this.onSelectItem(e.currentTarget.value);
            } else if (e.key === 'ArrowUp') {
                this.setState({
                    focusedInput: true,
                });
                this.dropdownList?.current?.decreaseHighlightIndex();
            } else if (e.key === 'ArrowDown') {
                this.setState({
                    focusedInput: true,
                });
                this.dropdownList?.current?.increaseHighlightIndex();
            }
        }
    };

    onCopy = async () => {
        const { inputItem } = this.state;
        await clipboardCopy(`${inputItem.value}`);
    };

    render() {
        const {
            label,
            maxItemsHeight,
            items,
            value,
            onValueChange,
            dark,
            theme,
            size,
            disable,
            loading,
            backgroundColor,
            copy,
            copyTooltip,
            ...props
        } = this.props;
        const { focusedInput, inputItem, changingInput, filters, currentTheme, copyButtonRef } = this.state;

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Dropdown]', 'Rendered');
            console.log({
                label,
                maxItemsHeight,
                items,
                value,
                onValueChange,
                dark,
                theme,
                size,
                disable,
                loading,
                backgroundColor,
                copy,
                copyTooltip,
                ...props,
            });
            console.groupEnd();
        }

        return (
            <DropdownContainer size={size} {...props}>
                {label && <DropdownLabel color={currentTheme.color}>{label}</DropdownLabel>}
                <DropdownInputContainer
                    backgroundColor={backgroundColor ?? currentTheme.backgroundColor}
                    borderColor={currentTheme.borderColor}
                    size={size}
                    disabled={disable}
                >
                    <Flex flexDirection="row-reverse" position="absolute" top="1px" right="1px" px="10px">
                        <CustomIcon componentsize={size} icon={icons.regular.caretDown} disabled={disable} />
                    </Flex>
                    {copy && (
                        <Flex flexDirection="row-reverse" position="absolute" top="1px" right="30px" zIndex={1}>
                            <Button
                                ref={(button) => this.setState({ copyButtonRef: button })}
                                backgroundColor={'transparent'}
                                textColor="black"
                                size="xs"
                                disabled={!inputItem.value}
                                disabledBackgroundColor={'transparent'}
                                onClick={this.onCopy}
                            >
                                <CustomIcon componentsize={size} icon={icons.regular.copy} />
                            </Button>
                        </Flex>
                    )}
                    {copy && copyTooltip && (
                        <Tooltip target={copyButtonRef} fontSize="11px">
                            {copyTooltip}
                        </Tooltip>
                    )}

                    <DropdownInput
                        ref={this.dropdownInputRef}
                        autoComplete="off"
                        onFocus={() => this.setState({ focusedInput: true })}
                        onClick={() => this.setState({ focusedInput: true })}
                        onBlur={this.onBlurInput}
                        onChange={this.onInputChange}
                        onKeyDown={this.onInputKeyDown}
                        color={currentTheme.color}
                        disabled={disable}
                        componentsize={size}
                        aria-label="dropdown input"
                    />
                    {loading ? (
                        <div>
                            <Icon icon={icons.animation.tails} />
                        </div>
                    ) : (
                        <div
                            css={css`
                                left: 1px;
                                font-size: 13px;
                                color: ${currentTheme.color};
                            `}
                        >
                            {!changingInput && inputItem.label}
                        </div>
                    )}
                    {focusedInput && (
                        <DropdownList
                            backgroundColor={currentTheme.list.backgroundColor}
                            selectedItemColor={currentTheme.list.selectedItemColor}
                            selectedItemBackgroundColor={currentTheme.list.selectedItemBackgroundColor}
                            hoverItemBackgroundColor={currentTheme.list.hoverItemBackgroundColor}
                            ref={this.dropdownList}
                            maxHeight={maxItemsHeight}
                            items={items!}
                            filters={filters}
                            activeItem={inputItem.label}
                            textColor={currentTheme.color}
                            onClick={this.onClick}
                        />
                    )}
                </DropdownInputContainer>
            </DropdownContainer>
        );
    }
}

export default Dropdown;
