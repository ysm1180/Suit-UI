import isPropValid from '@emotion/is-prop-valid';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { forwardRef } from 'react';
import {
    border,
    BorderProps,
    color,
    ColorProps,
    cssBreakpoints,
    CssStyleFn,
    DisplayProps,
    height,
    HeightProps,
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
} from '../../common';

export interface BoxStyleProps
    extends PositionProps,
        WidthProps,
        MinWidthProps,
        MaxWidthProps,
        HeightProps,
        MinHeightProps,
        MaxHeightProps,
        MarginProps,
        PaddingProps,
        StyleProps,
        ColorProps,
        DisplayProps,
        ZIndexProps,
        OverflowProps,
        BorderProps {
    inline?: boolean;
    hide?: boolean;
}

const box: CssStyleFn<BoxStyleProps> = ({ inline, hide, display = 'block', style }: BoxStyleProps) => {
    return [
        css`
            ${cssBreakpoints('display', hide ? 'none' : inline ? 'inline-block' : display, (value) => value)};
        `,
        {
            ...style,
        },
    ];
};

const BoxStyledElement = styled('div', {
    shouldForwardProp: (prop) => isPropValid(prop.toString()) && prop !== 'width',
})<BoxStyleProps>`
    min-width: 0;

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
    ${maxWidth}
    ${minWidth}
    ${height}
    ${maxHeight}
    ${minHeight}
    ${border}
    ${color}
    ${position}
    ${overflow}
    ${margin}
    ${padding}
    ${zIndex}

    ${box}
`;

export type BoxProps = BoxStyleProps & Omit<React.AllHTMLAttributes<HTMLDivElement>, keyof BoxStyleProps>;

const Box = forwardRef<HTMLDivElement, React.PropsWithChildren<BoxProps>>(({ children, as, ...props }, ref) => {
    console.log(props);
    return (
        <BoxStyledElement ref={ref} {...props}>
            {children}
        </BoxStyledElement>
    );
});

export default Box;
