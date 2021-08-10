import React from 'react';
import { RadioChangeEvent } from '../../types/radio';
import { useUniqueId } from '../../utilities/useUniqueId';
import { RadioGroupContextProvider } from './context';

interface Props {
    name?: string;
    onChange?: (e: RadioChangeEvent) => void;
}

export type RadioGroupProps = Props;

const RadioGroup: React.FC<RadioGroupProps> = ({ name, onChange, children }) => {
    const groupId = useUniqueId(name ?? 'radio-');
    return <RadioGroupContextProvider value={{ name: `${groupId}`, onChange }}>{children}</RadioGroupContextProvider>;
};

export default RadioGroup;
