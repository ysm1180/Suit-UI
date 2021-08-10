import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Checkbox, CheckboxProps } from '../src';

export default {
    title: 'suit-ui/Checkbox',
    component: Checkbox,
    argTypes: {
        color: { control: 'color' },
        checkedColor: { control: 'color' },
    },
    args: {
        color: 'black',
        checkedColor: '#1890ff',
    },
} as Meta;

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />;

export const LabelAndValue = Template.bind({});
LabelAndValue.args = {
    label: 'Checkbox',
    value: '1',
};

export const AlreadyChecked = Template.bind({});
AlreadyChecked.args = {
    ...LabelAndValue.args,
    label: 'Checked',
    checked: true,
};

export const CustomCheckedColor = Template.bind({});
CustomCheckedColor.args = {
    ...AlreadyChecked.args,
    checkedColor: 'red',
};
