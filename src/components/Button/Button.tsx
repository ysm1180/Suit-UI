/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { lighten } from 'polished';
import React, { forwardRef, Fragment, useCallback, useState } from 'react';
import {
    borderColor,
    BorderColorProps,
    borderRadius,
    BorderRadiusProps,
    borderStyle,
    BorderStyleProps,
    borderWidth,
    BorderWidthProps,
    color,
    ColorProps,
    cssBreakpoints,
    fontSize,
    FontSizeProps,
    height,
    HeightProps,
    margin,
    MarginProps,
    padding,
    PaddingProps,
    StyleProps,
    variant,
    VariantArgs,
    width,
    WidthProps,
} from '../../common';
import { mergeRefs } from '../../utilities/ref';
import { useFocus } from '../../utilities/useFocus';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import Tooltip from '../Tooltip/Tooltip';

type ButtonSize = 'xl' | 'lg' | 'large' | 'md' | 'medium' | 'sm' | 'small' | 'xs';

const sizeVariants: VariantArgs = {
    xl: css`
        font-size: 20px;
        padding: 12px 22px;
    `,
    large: css`
        font-size: 16px;
        padding: 8px 18px;
    `,
    medium: css`
        font-size: 14px;
        padding: 4px 15px;
    `,
    small: css`
        font-size: 12px;
        padding: 3px 7px;
    `,
    xs: css`
        font-size: 11px;
        padding: 2px 6px;
    `,
};
sizeVariants.lg = sizeVariants.large;
sizeVariants.md = sizeVariants.medium;
sizeVariants.sm = sizeVariants.small;

const tooltipSize: { [size in ButtonSize]?: FontSizeProps & PaddingProps } = {
    xl: {
        fontSize: '19px',
        padding: '10px',
    },
    large: {
        fontSize: '15px',
        padding: '7px',
    },
    medium: {
        fontSize: '13px',
    },
    small: {
        fontSize: '12px',
    },
    xs: {
        fontSize: '10px',
    },
};
tooltipSize.lg = tooltipSize.large;
tooltipSize.md = tooltipSize.medium;
tooltipSize.sm = tooltipSize.small;

interface ButtonContainerStyleProps {
    hoverTextColor?: string;
    hoverBackgroundColor?: string;
    activeTextColor?: string;
    activeBackgroundColor?: string;
    disabledBackgroundColor: string;
    disabled: boolean;
    size: ButtonSize;
    hide: boolean;
}

type ButtonContainerProps = ButtonContainerStyleProps &
    ColorProps &
    WidthProps &
    HeightProps &
    PaddingProps &
    BorderRadiusProps &
    BorderStyleProps &
    BorderWidthProps &
    BorderColorProps &
    FontSizeProps &
    MarginProps;
const ButtonContainer = styled.button<ButtonContainerProps>`
    position: relative;
    display: ${(props) => (props.hide ? 'none' : 'inline-flex')};
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    outline: transparent;
    user-select: none;
    cursor: pointer;
    text-decoration: none;

    ${variant<ButtonContainerProps>({
        prop: 'size',
        variants: sizeVariants,
    })}

    ${width}

    ${height}

    ${color}

    ${padding}

    ${margin}

    ${borderWidth}

    ${borderStyle}

    ${borderColor}

    ${borderRadius}

    ${fontSize}

    ${(props) => css`
        &:hover {
            ${props.hoverTextColor
                ? css`
                      color: ${props.hoverTextColor};
                  `
                : cssBreakpoints('color', props.color, (value) => lighten(0.05, `${value}`))}
            ${props.hoverBackgroundColor
                ? css`
                      background-color: ${props.hoverBackgroundColor};
                  `
                : cssBreakpoints('background-color', props.backgroundColor, (value) => lighten(0.05, `${value}`))}
        }
    `}

    .suit--is-focus-visible &:focus {
        &:after {
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            content: '';
            outline: 1px solid ${(props) => props.color};
            z-index: 1;
        }
    }

    ${(props) => css`
        &:active {
            ${props.activeTextColor
                ? css`
                      color: ${props.hoverTextColor};
                  `
                : cssBreakpoints('color', props.color, (value) => lighten(0.1, `${value}`))}
            ${props.activeBackgroundColor
                ? css`
                      background-color: ${props.hoverBackgroundColor};
                  `
                : cssBreakpoints('background-color', props.backgroundColor, (value) => lighten(0.1, `${value}`))}
        }
    `}

    ${(props) =>
        props.disabled &&
        css`
            background-color: ${props.disabledBackgroundColor};
            color: gray;
            cursor: not-allowed;
            &:hover {
                color: gray;
                background-color: ${props.disabledBackgroundColor};
            }
        `}
`;

export interface ButtonInnerProps {
    title?: string;
    disabled?: boolean;
    loading?: boolean;
    hoverTextColor?: string;
    hoverBackgroundColor?: string;
    activeTextColor?: string;
    activeBackgroundColor?: string;
    disabledBackgroundColor?: string;
    onClick?: (e: React.MouseEvent) => void;
    size?: ButtonSize;
    autoFocus?: boolean;
    hide?: boolean;
}

export type ButtonProps = React.PropsWithChildren<ButtonInnerProps> &
    ColorProps &
    WidthProps &
    HeightProps &
    PaddingProps &
    MarginProps &
    BorderStyleProps &
    BorderWidthProps &
    BorderRadiusProps &
    BorderColorProps &
    FontSizeProps &
    StyleProps;

/**
 * Primary UI component for user interaction
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            title,
            onClick,
            disabled = false,
            loading = false,
            textColor = 'white',
            hoverTextColor,
            activeTextColor,
            backgroundColor = '#36A3FF',
            hoverBackgroundColor,
            disabledBackgroundColor = '#bfccd6',
            activeBackgroundColor,
            size = 'md',
            borderStyle = 'solid',
            borderWidth = 0,
            borderColor = 'transparent',
            hide = false,
            ...props
        },
        ref
    ) => {
        useFocus();
        const [innerRef, setInnerRef] = useState<HTMLButtonElement | null>();

        const onButtonClick = useCallback(
            (e: React.MouseEvent) => {
                if (!disabled) {
                    onClick?.(e);
                }
            },
            [onClick, disabled]
        );

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Button]', 'Rendered');
            console.log({
                children,
                title,
                onClick,
                disabled,
                loading,
                textColor,
                hoverTextColor,
                activeTextColor,
                backgroundColor,
                hoverBackgroundColor,
                disabledBackgroundColor,
                activeBackgroundColor,
                size,
                borderStyle,
                borderWidth,
                borderColor,
                hide,
                ...props,
            });
            console.groupEnd();
        }

        return (
            <Fragment>
                <ButtonContainer
                    {...props}
                    ref={mergeRefs([(ref) => setInnerRef(ref), ref])}
                    size={size}
                    textColor={textColor}
                    backgroundColor={backgroundColor}
                    hoverTextColor={hoverTextColor}
                    hoverBackgroundColor={hoverBackgroundColor}
                    disabledBackgroundColor={disabledBackgroundColor}
                    activeTextColor={activeTextColor}
                    activeBackgroundColor={activeBackgroundColor}
                    onClick={onButtonClick}
                    disabled={disabled}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                    borderStyle={borderStyle}
                    tabIndex={disabled ? -1 : 0}
                    hide={hide}
                >
                    {loading ? <Icon icon={icons.regular.spinner} spin /> : children}
                </ButtonContainer>
                {!hide && title && (
                    <Tooltip
                        target={innerRef}
                        fontSize={tooltipSize[size]!.fontSize}
                        padding={tooltipSize[size]!.padding}
                    >
                        {title}
                    </Tooltip>
                )}
            </Fragment>
        );
    }
);

export default Button;
