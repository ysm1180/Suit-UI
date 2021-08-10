import { createContext } from 'react';
import { RadioChangeEvent } from '../../types/radio';

interface RadioGroupContextProps {
    name?: string;
    onChange?: (e: RadioChangeEvent) => void;
}

const RadioGroupContext = createContext<RadioGroupContextProps | null>(null);

export const RadioGroupContextProvider = RadioGroupContext.Provider;

export default RadioGroupContext;
