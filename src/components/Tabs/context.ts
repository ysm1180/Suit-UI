import { createContext } from 'react';
import { TabIdentity } from '../../types';

export interface TabContextProps {
    selectedId?: TabIdentity | null;
}

const TabContext = createContext<TabContextProps | null>(null);

export const TabContextProvider = TabContext.Provider;

export default TabContext;
