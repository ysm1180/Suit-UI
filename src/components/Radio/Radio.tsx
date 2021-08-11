import styled from '@emotion/styled';
import React, { forwardRef, Fragment, useCallback, useContext, useMemo } from 'react';
import { Flex } from '../../base';
import { RadioChangeEvent } from '../../types';
import RadioGroupContext from './context';

export interface RadioProps {
    value?: string | number | readonly string[];
    checked?: boolean;
    onChange?: (e: RadioChangeEvent) => void;
    name?: string;
    defaultChecked?: boolean;
}

const RadioInputLabel = styled.label`
    padding-left: 2px;
    font-size: 14px;
`;

const RadioButton = styled.input`
    outline: transparent;
`;

export const InternalRadio: React.ForwardRefRenderFunction<HTMLInputElement, RadioProps> = (
    { value, name, checked, onChange, children, defaultChecked },
    ref
) => {
    const context = useContext(RadioGroupContext);

    const radioProps = useMemo(() => {
        return {
            name: context?.name ?? name,
            onChange: context?.onChange ?? onChange,
        } as RadioProps;
    }, [context, onChange, name]);

    const id = `${radioProps.name ?? 'radio'}_${value?.toString() ?? 'value'}`;

    const onValueChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            radioProps.onChange?.({
                target: e.currentTarget,
                preventDefault: e.preventDefault.bind(e.currentTarget),
                stopPropagation: e.stopPropagation.bind(e.currentTarget),
                nativeEvent: e.nativeEvent,
            });
        },
        [radioProps]
    );

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[Radio]', 'Rendered');
        console.log({
            value,
            name,
            checked,
            onChange,
            children,
            defaultChecked,
        });
        console.groupEnd();
    }

    return (
        <Fragment>
            <Flex inline alignItems="center">
                <RadioButton
                    ref={ref}
                    type="radio"
                    id={id}
                    name={radioProps.name}
                    value={value}
                    checked={checked}
                    onChange={onValueChange}
                    defaultChecked={defaultChecked}
                />
                <RadioInputLabel htmlFor={id}>{children}</RadioInputLabel>
            </Flex>
        </Fragment>
    );
};

const Radio = forwardRef<HTMLInputElement, React.PropsWithChildren<RadioProps>>(InternalRadio);

export default Radio;
