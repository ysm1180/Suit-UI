import { Meta, Story } from '@storybook/react';
import React from 'react';
import { VirtualTable, VirtualTableProps } from '../src';

export default {
    title: 'suit-ui/VirtualTable',
    component: VirtualTable,
    argTypes: {
        rows: {
            table: {
                disable: true,
            },
        },
    },
} as Meta;

const Template: Story<VirtualTableProps> = ({ ...args }) => <VirtualTable {...args} />;

const columns = ['column1', 'column2', 'column3'];
const superLargeAmountData = [];
for (let i = 0; i < 10000; i++) {
    superLargeAmountData.push({
        column1: 'data',
        column2: `${i}`,
        column3: 'dummy',
    });
}

export const Default = Template.bind({});
Default.args = {
    columns,
    rows: superLargeAmountData,
};

export const AdjustHeight = Template.bind({});
AdjustHeight.args = {
    columns,
    rows: superLargeAmountData,
    height: 500,
};

export const DraggableCell = Template.bind({});
DraggableCell.args = {
    ...AdjustHeight.args,
    draggable: true,
};
