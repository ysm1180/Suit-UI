import isPropValid from '@emotion/is-prop-valid';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { forwardRef } from 'react';
import {
    alignItems,
    AlignItemsProps,
    BackgroundColorProps,
    border,
    BorderProps,
    color,
    ColorProps,
    CssStyleFn,
    DisplayProps,
    flex,
    FlexProps,
    height,
    HeightProps,
    justifyContent,
    JustifyContentProps,
    margin,
    MarginProps,
    maxHeight,
    MaxHeightProps,
    maxWidth,
    MaxWidthProps,
    minHeight,
    MinHeightProps,
    minWidth,
    MinWidthProps,
    overflow,
    OverflowProps,
    padding,
    PaddingProps,
    position,
    PositionProps,
    StyleProps,
    width,
    WidthProps,
    zIndex,
    ZIndexProps,
    cssBreakpoints,
} from '../../common';

export interface FlexStyleProps
    extends PositionProps,
        AlignItemsProps,
        DisplayProps,
        JustifyContentProps,
        WidthProps,
        MinWidthProps,
        MaxWidthProps,
        HeightProps,
        MinHeightProps,
        MaxHeightProps,
        MarginProps,
        PaddingProps,
        StyleProps,
        BackgroundColorProps,
        ColorProps,
        ZIndexProps,
        FlexProps,
        OverflowProps,
        BorderProps,
        StyleProps {
    inline?: boolean;
    hide?: boolean;
}

const flexbox: CssStyleFn<FlexStyleProps> = ({ inline, hide, display = 'flex', style }: FlexStyleProps) => {
    return [
        css`
            ${cssBreakpoints('display', hide ? 'none' : inline ? 'inline-flex' : display, (value) => value)};
        `,
        {
            ...style,
        },
    ];
};

const FlexStyledElement = styled('div', {
    shouldForwardProp: (prop) => isPropValid(prop.toString()) && prop !== 'width',
})<FlexStyleProps>`
    &::-webkit-scrollbar {
        width: 10px;
        height: 8px;
    }

    &::-webkit-scrollbar-thumb {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.35);
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0;
    }

    ${width}
    ${minWidth}
    ${maxWidth}
    ${height}
    ${minHeight}
    ${maxHeight}
    ${flex}
    ${overflow}
    ${border}
    ${zIndex}
    ${color}
    ${padding}
    ${margin}
    ${justifyContent}
    ${alignItems}
    ${position}

    ${flexbox}
`;

export type FlexboxProps = FlexStyleProps & Omit<React.AllHTMLAttributes<HTMLDivElement>, keyof FlexStyleProps>;

const Flex = forwardRef<HTMLDivElement, React.PropsWithChildren<FlexboxProps>>(({ children, as, ...props }, ref) => {
    return (
        <FlexStyledElement ref={ref} {...props}>
            {children}
        </FlexStyledElement>
    );
});

export default Flex;
