import styled from '@emotion/styled';
import React, { PureComponent } from 'react';
import { color, ColorProps, maxHeight, MaxHeightProps } from '../../common';
import DropdownItem from './DropdownItem';

const DropdownListContainer = styled.div<MaxHeightProps & ColorProps>`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 13px;
    padding: 0;
    margin: 0;
    z-index: 3;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);

    ${maxHeight}

    ${color}
`;

interface Props {
    items: (string | number | { label: string; value: string })[];
    activeItem: string;
    onClick: (e: React.MouseEvent, label: string, value: string) => void;
    filters: (string | RegExp)[];
    selectedItemColor: string;
    selectedItemBackgroundColor: string;
    hoverItemBackgroundColor: string;
}

interface States {
    highlightIndex: number;
    filterResult: (string | number | { label: string; value: string })[];
}

type DropdownListProps = Props & ColorProps & MaxHeightProps;

class DropdownList extends PureComponent<DropdownListProps, States> {
    static defaultProps = {
        activeItem: '',
        selectedItemColor: ' black',
        selectedItemBackgroundColor: '#F7F7F7',
        hoverItemBackgroundColor: '#F2F2F2',
    };

    constructor(props: DropdownListProps) {
        super(props);

        this.state = {
            highlightIndex: 0,
            filterResult: this.props.items.filter((item) => {
                if (this.props.filters.length === 0) {
                    return true;
                }

                let result = false;
                let testString: string;
                const { filters } = this.props;
                if (typeof item === 'object') {
                    testString = item.label;
                } else {
                    testString = `${item}`;
                }

                filters.forEach((filter) => {
                    if (!result) {
                        result = new RegExp(filter, 'i').test(testString);
                    }
                });
                return result;
            }),
        };
    }

    componentDidMount() {
        if (this.props.activeItem) {
            const index = this.state.filterResult.findIndex((item) => {
                if (typeof item === 'object') {
                    return item.label === this.props.activeItem;
                } else {
                    return `${item}` === this.props.activeItem;
                }
            });
            if (index !== -1) {
                this.setState({
                    highlightIndex: index,
                });
            } else {
                this.setState({
                    highlightIndex: 0,
                });
            }
        } else {
            this.setState({
                highlightIndex: 0,
            });
        }
    }

    componentDidUpdate(prevProps: DropdownListProps, prevState: States) {
        const { filters } = this.props;

        if (JSON.stringify(prevProps.filters) !== JSON.stringify(filters)) {
            if (filters.length > 0) {
                this.setState({
                    filterResult: this.props.items.filter((item) => {
                        let result = false;
                        let testString: string;
                        if (typeof item === 'object') {
                            testString = item.label;
                        } else {
                            testString = `${item}`;
                        }

                        filters.forEach((filter) => {
                            if (!result) {
                                result = new RegExp(filter, 'i').test(testString);
                            }
                        });
                        return result;
                    }),
                });
            } else {
                this.setState({
                    filterResult: this.props.items,
                });
            }
        }

        if (JSON.stringify(prevState.filterResult) !== JSON.stringify(this.state.filterResult)) {
            if (this.props.activeItem) {
                const index = this.state.filterResult.findIndex(
                    (item) => `${typeof item === 'object' ? item.value : item}` === this.props.activeItem
                );
                if (index !== -1) {
                    this.setState({
                        highlightIndex: index,
                    });
                } else {
                    this.setState({
                        highlightIndex: 0,
                    });
                }
            } else {
                this.setState({
                    highlightIndex: 0,
                });
            }
        }
    }

    decreaseHighlightIndex() {
        if (this.state.highlightIndex > 0) {
            this.setState({
                highlightIndex: this.state.highlightIndex - 1,
            });
        }
    }

    increaseHighlightIndex() {
        if (this.state.highlightIndex < this.state.filterResult.length - 1) {
            this.setState({
                highlightIndex: this.state.highlightIndex + 1,
            });
        }
    }

    getCurrentItem() {
        const item = this.state.filterResult[this.state.highlightIndex];
        if (item === undefined) {
            return undefined;
        }

        return typeof item === 'object' ? { ...item } : { label: `${item}`, value: `${item}` };
    }

    render() {
        const {
            items,
            filters,
            activeItem,
            selectedItemBackgroundColor,
            selectedItemColor,
            hoverItemBackgroundColor,
            onClick,
            ...props
        } = this.props;
        const { highlightIndex, filterResult } = this.state;

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[DropdownList]', 'Rendered');
            console.log({
                items,
                filters,
                activeItem,
                selectedItemBackgroundColor,
                selectedItemColor,
                hoverItemBackgroundColor,
                onClick,
                ...props,
            });
            console.groupEnd();
        }

        return (
            <DropdownListContainer role="listbox" aria-label="dropdown list" {...props}>
                {filterResult.length > 0 ? (
                    filterResult.map((item, index) => (
                        <DropdownItem
                            selectable={true}
                            active={(typeof item === 'object' ? `${item.value}` : `${item}`) === activeItem}
                            selected={highlightIndex === index}
                            onClick={onClick}
                            key={index}
                            item={item}
                            selectedColor={selectedItemColor}
                            selectedBackgroundColor={selectedItemBackgroundColor}
                            hoverBackgroundColor={hoverItemBackgroundColor}
                        />
                    ))
                ) : (
                    <DropdownItem
                        selected={true}
                        selectedColor={selectedItemColor}
                        selectedBackgroundColor={selectedItemBackgroundColor}
                        item="결과를 찾을 수 없습니다."
                    />
                )}
            </DropdownListContainer>
        );
    }
}

export default DropdownList;
