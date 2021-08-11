import styled from '@emotion/styled';
import React, { forwardRef } from 'react';
import {
    color,
    cssLength,
    CssStyleFn,
    display,
    fontSize,
    fontStyle,
    fontWeight,
    height,
    margin,
    overflow,
    padding,
    textAlign,
    width,
} from '../../common';
import { TextStyleProps } from './Text';

const text: CssStyleFn<TextStyleProps> = ({ fontFamily, fontVariant, lineHeight, style }: TextStyleProps) => ({
    fontFamily,
    fontVariant,
    lineHeight: cssLength(lineHeight),
    ...style,
});

const TextStyledSpanElement = styled.span<TextStyleProps>`
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

export type TextSpanProps = TextStyleProps & Omit<React.AllHTMLAttributes<HTMLSpanElement>, keyof TextStyleProps>;

const TextSpan: React.FC<TextSpanProps> = forwardRef<HTMLSpanElement, React.PropsWithChildren<TextSpanProps>>(
    ({ children, as, ...props }, ref) => {
        return (
            <TextStyledSpanElement ref={ref} {...props}>
                {children}
            </TextStyledSpanElement>
        );
    }
);

export default TextSpan;
