import { Meta, Story } from '@storybook/react';
import React, { Fragment } from 'react';
import Radio, { RadioProps } from '../src/components/Radio/Radio';
import RadioGroup, { RadioGroupProps } from '../src/components/Radio/RadioGroup';

export default {
    title: 'suit-ui/Radio',
    component: Radio,
} as Meta;

const GroupTemplate: Story<RadioProps> = (args) => (
    <Fragment>
        <RadioGroup>
            <Radio value="1">One</Radio>
            <Radio value="2">Two</Radio>
            <Radio value="3">Three</Radio>
        </RadioGroup>
        <RadioGroup>
            <Radio value="1">One</Radio>
            <Radio value="2">Two</Radio>
            <Radio value="3">Three</Radio>
        </RadioGroup>
    </Fragment>
);

export const Groups = GroupTemplate.bind({});
Groups.args = {};

const DefaultCheckedTemplate: Story<RadioGroupProps> = (args) => (
    <Fragment>
        <RadioGroup>
            <Radio value="1" defaultChecked>
                One
            </Radio>
            <Radio value="2">Two</Radio>
            <Radio value="3">Three</Radio>
        </RadioGroup>
        <RadioGroup>
            <Radio value="1">One</Radio>
            <Radio value="2" defaultChecked>
                Two
            </Radio>
            <Radio value="3">Three</Radio>
        </RadioGroup>
    </Fragment>
);

export const DefaultChecked = DefaultCheckedTemplate.bind({});
DefaultChecked.args = {};
