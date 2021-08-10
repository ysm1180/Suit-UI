import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Switch, SwitchProps } from '../src';

export default {
    title: 'suit-ui/Switch',
    component: Switch,
    argTypes: {
        color: { control: 'color' },
        checkedColor: { control: 'color' },
    },
    args: {
        chekedColor: '#3b91ff',
        color: 'inherit',
    },
} as Meta;

const Template: Story<SwitchProps> = ({ ...args }) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: 'Switch',
    value: 'value',
};

export const VariableSize = ({ ...props }) => {
    props.margin = { x: 10 };

    return (
        <>
            <Switch size="sm" label="Switch" {...props}></Switch>
            <Switch size="md" label="Switch" {...props}></Switch>
        </>
    );
};
VariableSize.argTypes = {
    size: { table: { disable: true } },
    margin: { table: { disable: true } },
};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
    ...Default.args,
    checked: true,
};

export const CustomColor = Template.bind({});
CustomColor.args = {
    ...Default.args,
    checkedColor: 'red',
    color: 'blue',
};

export const Disable = Template.bind({});
Disable.args = {
    ...CustomColor.args,
    disable: true,
};
