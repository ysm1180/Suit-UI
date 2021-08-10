import styled from '@emotion/styled';
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

interface DropdownListItemStyle {
    active?: boolean;
    selected?: boolean;
    selectable?: boolean;
    selectedBackgroundColor?: string;
    selectedColor?: string;
    hoverBackgroundColor?: string;
}

const DropdownListItem = styled.div<DropdownListItemStyle>`
    position: relative;
    cursor: ${(props) => (props.selectable ? 'pointer' : 'auto')};
    border-top: 1px solid #ddd;

    height: auto;

    padding: 11px 16px;
    font-weight: ${(props) => (props.active ? 800 : 400)};

    color: ${(props) => (props.selected ? props.selectedColor : 'inherit')};
    background-color: ${(props) => (props.selected ? props.selectedBackgroundColor : undefined)};

    &:hover {
        background-color: ${(props) => props.hoverBackgroundColor};
    }
`;

interface Props {
    selected?: boolean;
    selectedColor?: string;
    selectedBackgroundColor?: string;
    hoverBackgroundColor?: string;
    selectable?: boolean;
    active?: boolean;
    item: string | number | { label: string; value: string };
    onClick?: (e: React.MouseEvent, label: string, value: string) => void;
}

type DropdownItemProps = Props;

class DropdownItem extends PureComponent<DropdownItemProps> {
    componentDidMount() {
        if (this.props.selected) {
            this.scrollToItem();
        }
    }

    componentDidUpdate(prevProps: DropdownItemProps) {
        if (!prevProps.selected && this.props.selected) {
            this.scrollToItem();
        }
    }

    scrollToItem = () => {
        try {
            const itemElement = findDOMNode(this) as HTMLElement;
            if (itemElement) {
                const listElement = itemElement.parentNode as HTMLElement;
                if (listElement) {
                    listElement.scrollTop = itemElement.offsetTop;
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        const {
            item,
            selected,
            active,
            selectable,
            onClick,
            selectedColor,
            selectedBackgroundColor,
            hoverBackgroundColor,
        } = this.props;

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[DropdownItem]', 'Rendered');
            console.log({
                item,
                selected,
                active,
                selectable,
                onClick,
                selectedColor,
                selectedBackgroundColor,
                hoverBackgroundColor,
            });
            console.groupEnd();
        }

        const label = typeof item === 'object' ? item.label : `${item}`;
        const value = typeof item === 'object' ? item.value : `${item}`;

        return (
            <DropdownListItem
                role="option"
                active={active}
                selected={selected}
                aria-selected={selected}
                selectedColor={selectedColor}
                selectedBackgroundColor={selectedBackgroundColor}
                hoverBackgroundColor={hoverBackgroundColor}
                selectable={selectable}
                onMouseDown={(e) => onClick?.(e, label, value)}
            >
                {label}
            </DropdownListItem>
        );
    }
}

export default DropdownItem;
