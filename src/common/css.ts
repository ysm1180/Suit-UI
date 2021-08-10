import { isNumber } from 'lodash-es';
import { css } from '@emotion/react';

export const breakpointPixels = {
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
};

export type GlobalCssValue = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset';

export interface Breakpoint<T> {
    xl?: T;
    lg?: T;
    md?: T;
    sm?: T;
    xs?: T;
}

export type Breakpoints<T extends number | string | symbol> = T | Breakpoint<T>;

export type Length = string | number;

export type CssCursorProperty =
    | 'auto'
    | 'default'
    | 'none'
    | 'context-menu'
    | 'help'
    | 'pointer'
    | 'progress'
    | 'wait'
    | 'cell'
    | 'crosshair'
    | 'text'
    | 'vertical-text'
    | 'alias'
    | 'copy'
    | 'move'
    | 'no-drop'
    | 'not-allowed'
    | 'e-resize'
    | 'n-resize'
    | 'ne-resize'
    | 'nw-resize'
    | 's-resize'
    | 'se-resize'
    | 'sw-resize'
    | 'w-resize'
    | 'ew-resize'
    | 'ns-resize'
    | 'nesw-resize'
    | 'nwse-resize'
    | 'col-resize'
    | 'row-resize'
    | 'all-scroll'
    | 'zoom-in'
    | 'zoom-out'
    | 'grab'
    | 'grabbing';

export type CssFontWeightProperty = 'normal' | 'bold' | 'lighter' | 'bolder' | number | GlobalCssValue;

export type CssFontStyleProperty = 'normal' | 'italic' | 'oblique' | `oblique ${string}` | GlobalCssValue;

export type CssTextAlignProperty = 'center' | 'end' | 'justify' | 'left' | 'right' | 'start' | GlobalCssValue;

export type CssOverflowProperty = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalCssValue;

export type CssBorderStyleProperty =
    | 'solid'
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'outset'
    | 'inset'
    | 'hidden'
    | 'none'
    | GlobalCssValue;

export type CssLineWidthProperty =
    | Length
    | 'thin'
    | 'medium'
    | 'thick'
    | `${Length} ${Length}`
    | `${Length} ${Length} ${Length}`
    | `${Length} ${Length} ${Length} ${Length}`;

export const cssLength = (length?: Length) => {
    const numberToUnit = (value: number) => {
        let lengthValue: string;
        if (length === 0) {
            lengthValue = '0';
        } else if (value > 0 && value < 1) {
            lengthValue = `${value * 100}%`;
        } else {
            lengthValue = `${value}px`;
        }

        return lengthValue;
    };

    if (!length) {
        return undefined;
    }

    let lengthValue: string;
    if (typeof length === 'number') {
        lengthValue = numberToUnit(length);
    } else {
        const lengths = length.split(' ');
        lengthValue = `${lengths
            .map((length) => {
                if (isNumber(length)) {
                    return numberToUnit(Number(length));
                }
                return length;
            })
            .join(' ')}`;
    }

    return lengthValue;
};

export const cssBreakpoints = <T extends string | number | symbol>(
    key: string,
    value?: T | Breakpoints<T>,
    transform: (value: T) => string | undefined = (value) => undefined
) => {
    let appliedValue: { [bp in 'xs' | 'sm' | 'md' | 'lg' | 'xl']?: T } = {};
    if (typeof value === 'object') {
        appliedValue = { ...value };
    } else {
        appliedValue.xs = value;
    }

    const defaultValue = appliedValue.xs || appliedValue.sm || appliedValue.md || appliedValue.lg || appliedValue.xl;
    if (!defaultValue) {
        return undefined;
    }
    return css`
        // Small devices (landscape phones, 576px and up)
        ${appliedValue.sm &&
        css`
            @media (min-width: ${breakpointPixels.sm}px) {
                ${key}: ${transform(appliedValue.sm)};
            }
        `} // Medium devices (tablets, 768px and up)
        ${appliedValue.md &&
        css`
            @media (min-width: ${breakpointPixels.md}px) {
                ${key}: ${transform(appliedValue.md)};
            }
        `} // Large devices (desktops, 992px and up)
        ${appliedValue.lg &&
        css`
            @media (min-width: ${breakpointPixels.lg}px) {
                ${key}: ${transform(appliedValue.lg)};
            }
        `} // X-Large devices (large desktops, 1200px and up)
        ${appliedValue.xl &&
        css`
            @media (min-width: ${breakpointPixels.xl}px) {
                ${key}: ${transform(appliedValue.xl)};
            }
        `}

        ${defaultValue &&
        css`
            ${key}: ${transform(defaultValue)}
        `};
    `;
};
