import { Meta, Story } from '@storybook/react';
import React, { Fragment, ReactNode, useState } from 'react';
import { Label, Tooltip, TooltipProps } from '../src';

export default {
    title: 'suit-ui/Tooltip',
    component: Tooltip,
    args: {
        toggle: 'hover',
        delay: 0,
        distance: { x: 0, y: 5 },
        placement: 'bottom',
        padding: '5px',
    },
    argTypes: {
        target: { table: { disable: true } },
        titleTextColor: { control: 'color' },
        bodyTextColor: { control: 'color' },
    },
} as Meta;

const Template: Story<TooltipProps & { children: ReactNode }> = ({ title, children, ...args }) => {
    const [labelElement, setLabelElement] = useState<HTMLDivElement>(null);
    return (
        <Fragment>
            <Label ref={(ref) => setLabelElement(ref)}>mouse over</Label>
            <Tooltip target={labelElement} title={title} {...args}>
                {children}
            </Tooltip>
        </Fragment>
    );
};

export const SimpleUsage = Template.bind({});
SimpleUsage.args = {
    title: 'Title',
    children: 'wow',
};
