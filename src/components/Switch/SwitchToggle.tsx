/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { memo } from 'react';
import { textColor, TextColorProps, variant, VariantArgs, VariantStyle } from '../../common';
import { useUniqueId } from '../../utilities/useUniqueId';
import { SwitchSize, SwtichSizeProps } from './types';

const sizeVariants: VariantArgs = {
    medium: css`
        min-width: 44px;
        height: 22px;

        &:after {
            width: 18px;
            height: 18px;
        }
    `,
    small: css`
        min-width: 32px;
        height: 17px;

        &:after {
            width: 13px;
            height: 13px;
        }
    `,
};
sizeVariants.md = sizeVariants.medium;
sizeVariants.sm = sizeVariants.small;

interface SwitchButtonStyleProps {
    checked: boolean;
    disable: boolean;
    checkColor: string;
    noTransition: boolean;
}

const checkSizeVariants: VariantStyle<SwitchButtonStyleProps> = (props) => {
    const variants: VariantArgs = {
        medium: css`
            &:after {
                left: 23px;
            }
        `,
        small: css`
            &:after {
                left: 16px;
            }
        `,
    };
    variants.md = variants.medium;
    variants.sm = variants.small;

    return {
        style: css`
            background-color: ${props?.checkColor};
        `,
        variants,
    };
};

const SwitchButton = styled.button<SwitchButtonStyleProps & SwtichSizeProps>`
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    border-radius: 100px;
    border: 1px solid transparent;
    margin: 0;
    padding: 0;
    cursor: pointer;
    outline: 0;
    background-color: #bfbfbf;

    &:after {
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #fff;
        border-radius: 18px;
        cursor: pointer;
        content: ' ';
    }

    ${variant<SwtichSizeProps>({
        prop: 'size',
        variants: sizeVariants,
    })}

    ${(props) =>
        props.checked &&
        variant<SwtichSizeProps & SwitchButtonStyleProps>({
            prop: 'size',
            variants: checkSizeVariants,
        })}

    ${(props) =>
        props.disable &&
        css`
            cursor: not-allowed;
            background-color: #444;

            &:after {
                cursor: not-allowed;
            }
        `}

    ${(props) =>
        !props.noTransition &&
        css`
            &:after {
                transition: all 0.2s ease;
            }
        `}
`;

const labelSizeVariants: VariantArgs = {
    medium: css`
        font-size: 15px;
        padding-left: 8px;
    `,
    small: css`
        font-size: 13px;
        padding-left: 5px;
    `,
};
labelSizeVariants.md = labelSizeVariants.medium;
labelSizeVariants.sm = labelSizeVariants.small;

interface SwitchLabelStyleProps {
    disable: boolean;
}

const SwitchLabel = styled.label<SwitchLabelStyleProps & SwtichSizeProps & TextColorProps>`
    cursor: pointer;

    ${variant<SwtichSizeProps>({
        prop: 'size',
        variants: labelSizeVariants,
    })}

    ${textColor}

    ${(props) =>
        props.disable &&
        css`
            cursor: not-allowed;
            color: #444;
        `}
`;

interface SwitchToggleProps {
    checked: boolean;
    disable: boolean;
    checkedColor: string;
    size: SwitchSize;
    noAnimation: boolean;
    onClick?: () => void;
}

const SwtichToggle: React.FC<SwitchToggleProps & TextColorProps> = memo(
    ({ disable, checked, checkedColor, size, textColor, children, noAnimation, onClick }) => {
        const switchId = useUniqueId('switch:');

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SwtichToggle]', 'Rendered', switchId);
            console.log({
                disable,
                checked,
                checkedColor,
                size,
                textColor,
                children,
                noAnimation,
                onClick,
            });
            console.groupEnd();
        }

        return (
            <React.Fragment>
                <SwitchButton
                    role="switch"
                    aria-checked={checked}
                    noTransition={noAnimation}
                    disable={disable}
                    checked={checked}
                    checkColor={checkedColor}
                    size={size}
                    id={switchId}
                    onClick={onClick}
                />
                <SwitchLabel disable={disable} textColor={textColor} size={size} htmlFor={switchId}>
                    {children}
                </SwitchLabel>
            </React.Fragment>
        );
    }
);

export default SwtichToggle;
