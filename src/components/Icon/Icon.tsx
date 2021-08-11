/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { SVGAttributes } from 'react';
import { variant, VariantArgs } from '../../common';
import { IconDefinition } from '../../types';

export type IconSize = 'xs' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';

interface IconSvgStyleProps {
    spin: boolean;
    iconSize: IconSize;
}

const sizeVariants: VariantArgs = {
    xs: css`
        width: 0.875em;
        font-size: 0.75em;
    `,
    sm: css`
        width: 0.9375em;
        font-size: 0.875em;
    `,
    '1x': css`
        width: 1em;
        font-size: 1em;
    `,
    '2x': css`
        width: 1em;
        font-size: 2em;
    `,
    '3x': css`
        width: 1em;
        font-size: 3em;
    `,
    '4x': css`
        width: 1em;
        font-size: 4em;
    `,
    '5x': css`
        width: 1em;
        font-size: 5em;
    `,
    '6x': css`
        width: 1em;
        font-size: 6em;
    `,
    '7x': css`
        width: 1em;
        font-size: 7em;
    `,
    '8x': css`
        width: 1em;
        font-size: 8em;
    `,
    '9x': css`
        width: 1em;
        font-size: 9em;
    `,
    '10x': css`
        width: 1em;
        font-size: 10em;
    `,
};

const IconSvg = styled.svg<IconSvgStyleProps>`
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    svg:not(:root)& {
        overflow: visible;
    }

    display: inline-block;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;

    ${variant<IconSvgStyleProps>({
        prop: 'iconSize',
        variants: sizeVariants,
    })}

    ${(props) =>
        props.spin &&
        css`
            animation: rotate 2s linear infinite;
        `}
`;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'mask' | 'transform' | 'viewBox'> {
    icon: IconDefinition;
    spin?: boolean;
    size?: IconSize;
}

const Icon: React.FC<IconProps> = ({ icon, spin = false, size = '1x', ...props }) => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[Icon]', 'Rendered');
        console.log({
            icon,
            spin,
            size,
            ...props,
        });
        console.groupEnd();
    }

    return (
        <IconSvg
            role="img"
            aria-label={icon.title}
            viewBox={`0 0 ${icon.width} ${icon.height}`}
            spin={spin}
            iconSize={size}
            {...props}
        >
            {icon.pathData && <path fill="currentColor" d={icon.pathData} />}
            {icon.raw && icon.raw}
        </IconSvg>
    );
};

export default Icon;
