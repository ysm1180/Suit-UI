import styled from '@emotion/styled';
import React, { forwardRef } from 'react';
import {
    BackgroundColorProps,
    color,
    ColorProps,
    cssLength,
    CssStyleFn,
    display,
    DisplayProps,
    fontSize,
    FontSizeProps,
    fontStyle,
    FontStyleProps,
    fontWeight,
    FontWeightProps,
    height,
    HeightProps,
    Length,
    margin,
    MarginProps,
    overflow,
    OverflowProps,
    padding,
    PaddingProps,
    StyleProps,
    textAlign,
    TextAlignProps,
    width,
    WidthProps,
} from '../../common';
import TextSpan from './TextSpan';

export interface TextStyleProps
    extends FontSizeProps,
        WidthProps,
        HeightProps,
        MarginProps,
        PaddingProps,
        StyleProps,
        ColorProps,
        BackgroundColorProps,
        DisplayProps,
        TextAlignProps,
        OverflowProps,
        FontWeightProps,
        FontStyleProps {
    fontFamily?: string;
    fontVariant?: string;
    lineHeight?: Length;
}

const text: CssStyleFn<TextStyleProps> = ({ fontFamily, fontVariant, lineHeight, display, style }: TextStyleProps) => ({
    fontFamily,
    fontVariant,
    lineHeight: cssLength(lineHeight),
    ...style,
});

const TextStyledDivElement = styled.div<TextStyleProps>`
    ${display}
    ${width}
    ${height}
    ${margin}
    ${padding}
    ${textAlign}
    ${color}
    ${overflow}
    ${margin}
    ${padding}
    ${fontSize}
    ${fontStyle}
    ${fontWeight}

    ${text}
`;

export type TextProps = TextStyleProps & Omit<React.AllHTMLAttributes<HTMLDivElement>, keyof TextStyleProps>;
export type TextElement = React.FC<TextProps> & {
    Span?: typeof TextSpan;
};

const Text: TextElement = forwardRef<HTMLDivElement, React.PropsWithChildren<TextProps>>(
    ({ children, as, ...props }, ref) => {
        return (
            <TextStyledDivElement ref={ref} {...props}>
                {children}
            </TextStyledDivElement>
        );
    }
);

Text.Span = TextSpan;

export default Text;
