import React, { ReactNode } from 'react';
import { TabIdentity } from '../../types';

export interface TabLabelProps {
    id: TabIdentity;
    tab?: ReactNode;
    disable?: boolean;
    visible?: boolean;
    close?: boolean;
    fixed?: boolean;
}

const TabLabel: React.FC<TabLabelProps> = () => {
    return null;
};

export default TabLabel;
