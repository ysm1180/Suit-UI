import React, { ReactNode, useContext } from 'react';
import { TabIdentity } from '../../types';
import TabContext from './context';
import { Flex, FlexboxProps } from '../../base';

export interface TabPanelInnerProps {
    id: TabIdentity;
    tab?: ReactNode;
    disable?: boolean;
    visible?: boolean;
    close?: boolean;
    fixed?: boolean;
}

export type TabPanelProps = TabPanelInnerProps & Omit<FlexboxProps, 'id' | 'hide'>;

const TabPanel: React.FC<TabPanelProps> = ({ id, tab, disable, visible, close, children, ...props }) => {
    const tabContext = useContext(TabContext);

    return (
        <Flex role="tabpanel" {...props} hide={tabContext?.selectedId !== id}>
            {children}
        </Flex>
    );
};

export default TabPanel;
