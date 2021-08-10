/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { MarginProps, PaddingProps, textColor, TextColorProps } from '../../common';
import { Flex } from '../../base';
import SwitchToggle from './SwitchToggle';
import { SwitchSize } from './types';

export interface SwitchInnerProps {
    checked?: boolean;
    label?: string;
    value?: string;
    onChange?: (value: string, checked: boolean) => void;
    checkedColor?: string;
    size?: SwitchSize;
    disable?: boolean;
    noAnimation?: boolean;
}

export type SwitchProps = SwitchInnerProps & TextColorProps & MarginProps & PaddingProps;

const Switch: React.FC<SwitchProps> = memo(
    ({
        value = '',
        label = value,
        checked = false,
        onChange,
        checkedColor = '#3b91ff',
        textColor,
        size = 'medium',
        disable = false,
        noAnimation = false,
        ...props
    }) => {
        const [swtichChecked, setSwitchChecked] = useState(checked);

        useEffect(() => {
            setSwitchChecked(checked);
        }, [checked]);

        const onClick = useCallback(() => {
            if (!disable) {
                setSwitchChecked((s) => {
                    onChange?.(value, !s);
                    return !s;
                });
            }
        }, [disable, onChange, value]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Switch]', 'Rendered');
            console.log({
                value,
                label,
                checked,
                onChange,
                checkedColor,
                textColor,
                size,
                disable,
                noAnimation,
                ...props,
            });
            console.groupEnd();
        }

        return (
            <Flex inline alignItems="center" {...props}>
                <SwitchToggle
                    noAnimation={noAnimation}
                    disable={disable}
                    checked={swtichChecked}
                    checkedColor={checkedColor}
                    size={size}
                    textColor={textColor}
                    onClick={onClick}
                >
                    {label}
                </SwitchToggle>
            </Flex>
        );
    }
);

export default Switch;
