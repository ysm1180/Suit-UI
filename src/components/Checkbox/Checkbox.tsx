import styled from '@emotion/styled';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { textColor, TextColorProps } from '../../common';
import { useFocus } from '../../utilities/useFocus';
import { useUniqueId } from '../../utilities/useUniqueId';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';

const CheckboxLabelContainer = styled.label<TextColorProps>`
    position: relative;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    display: flex;
    line-height: unset;
    cursor: pointer;
    outline: transparent;
    left: 2px;
    align-items: center;

    ${textColor};
`;

CheckboxLabelContainer.defaultProps = {
    color: 'black',
};

const CheckboxContainer = styled.div`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-flex;
    white-space: nowrap;
    vertical-align: middle;
    outline: none;
    cursor: pointer;
`;

const CheckboxInput = styled.input`
    position: absolute;
    cursor: pointer;
    opacity: 0;

    .suit--is-focus-visible &:focus + label {
        &:before {
            position: absolute;
            top: -1px;
            left: -2px;
            right: -1px;
            bottom: -3px;
            content: '';
            border: 1px dashed black;
        }
    }
`;

const CheckboxIcon = styled(Icon)``;

interface CheckboxStyleProps {
    checked?: boolean;
    checkedColor?: string;
}

const CheckboxInner = styled.span<CheckboxStyleProps>`
    position: relative;
    top: -1px;
    left: 0;
    display: flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-collapse: separate;
    transition: all 0.3s;

    background-color: ${(props) => (props.checked ? props.checkedColor ?? '#1890ff' : '#fff')};

    ${CheckboxIcon} {
        opacity: ${(props) => (props.checked ? '' : '0')};
        transition: all 0.3s;
    }
`;

const CheckBoxLabel = styled.span`
    padding-left: 8px;
    padding-right: 8px;
`;

export interface CheckboxInnerProps {
    label?: string;
    value?: string;
    checked?: boolean;
    checkedColor?: string;
    onChange?: (value: string, checked: boolean) => void;
}

export type CheckboxProps = CheckboxInnerProps & TextColorProps;

const Checkbox: React.FC<CheckboxProps> = memo(
    ({ value = '', label = value, checked = false, checkedColor, onChange, textColor }) => {
        useFocus();

        const checkboxId = useUniqueId('checkbox:');
        const [checkState, setCheckState] = useState(checked);

        const onClick = useCallback(
            (e: React.MouseEvent) => {
                setCheckState(!checkState);
                onChange?.(value, !checkState);
            },
            [onChange, value, checkState]
        );

        useEffect(() => {
            setCheckState(checked);
        }, [checked]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Checkbox]', 'Rendered');
            console.log({ value, label, checked, checkedColor, onChange, textColor });
            console.groupEnd();
        }

        return (
            <CheckboxContainer>
                <CheckboxInput onClick={onClick} type="checkbox" id={checkboxId}></CheckboxInput>
                <CheckboxLabelContainer textColor={textColor} htmlFor={checkboxId}>
                    <CheckboxInner checked={checkState} checkedColor={checkedColor}>
                        <CheckboxIcon icon={icons.regular.check} size="xs" color="white" />
                    </CheckboxInner>

                    <CheckBoxLabel>{label}</CheckBoxLabel>
                </CheckboxLabelContainer>
            </CheckboxContainer>
        );
    }
);

export default Checkbox;
