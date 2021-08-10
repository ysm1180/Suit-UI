import { Meta, Story } from '@storybook/react';
import React from 'react';
import { PageSplit, PageSplitProps } from '../src';

export default {
    title: 'suit-ui/PageSplit',
    component: PageSplit,
    subcomponents: {
        'PageSplit.Left': PageSplit.Left,
        'PageSplit.Spliter': PageSplit.Spliter,
        'PageSplit.Right': PageSplit.Right,
    },
    argTypes: {
        leftContent: { table: { disable: true } },
        rightContent: { table: { disable: true } },
    },
} as Meta;

const Template: Story<
    PageSplitProps & {
        spliterWidth: string;
        spliterColor: string;
        leftContent: React.ReactElement;
        rightContent: React.ReactElement;
    }
> = ({ spliterColor, spliterWidth, leftContent, rightContent, ...args }) => (
    <PageSplit {...args}>
        <PageSplit.Left>{leftContent}</PageSplit.Left>
        <PageSplit.Spliter color={spliterColor} width={spliterWidth} />
        <PageSplit.Right>{rightContent}</PageSplit.Right>
    </PageSplit>
);

export const SimpleUsage = Template.bind({});
SimpleUsage.args = {
    leftContent: <div style={{ height: '20vh' }}>left</div>,
    rightContent: <div style={{ paddingLeft: '20px' }}>right</div>,
};

export const ColorAndWidth = Template.bind({});
ColorAndWidth.args = {
    ...SimpleUsage.args,
    spliterColor: 'red',
    spliterWidth: '3px',
};

export const MinWidthAndMaxWidth = Template.bind({});
MinWidthAndMaxWidth.args = {
    initOffset: 400,
    minSidebarWidth: 300,
    maxSidebarWidth: 600,
    leftContent: <div style={{ height: '20vh' }}>my min width is 300px and max width is 600px</div>,
    rightContent: <div style={{ paddingLeft: '20px' }}>right</div>,
};

export const ThresholdWidth = Template.bind({});
ThresholdWidth.args = {
    initOffset: 400,
    minSidebarWidth: 300,
    maxSidebarWidth: 600,
    thresholdWidth: 100,
    leftContent: <div style={{ height: '20vh' }}>width is less than 100px and bye~</div>,
    rightContent: <div style={{ paddingLeft: '20px' }}>right</div>,
};

export const PivotIsRight = Template.bind({});
PivotIsRight.args = {
    sidebarPosition: 'right',
    initOffset: 400,
    minSidebarWidth: 300,
    maxSidebarWidth: 600,
    thresholdWidth: 100,
    rightContent: <div style={{ height: '20vh', paddingLeft: '20px' }}>width is less than 100px and bye~</div>,
    leftContent: <div>left</div>,
};
