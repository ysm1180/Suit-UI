import React from 'react';
import { Story, Meta } from '@storybook/react';

import { JsonDisplay, JsonDisplayProps } from '../src';

export default {
    title: 'suit-ui/JsonDisplay',
    component: JsonDisplay,
    args: {
        indent: 15,
    },
} as Meta;

const Template: Story<JsonDisplayProps> = (args) => <JsonDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Title = Template.bind({});
Title.args = {
    title: 'JSON',
};

export const BorderColor = Template.bind({});
BorderColor.args = {
    ...Title.args,
    borderColor: 'red',
};

export const SimpleValue = Template.bind({});
SimpleValue.args = {
    ...Title.args,
    value: 'hello',
};

export const JsonValue = Template.bind({});
JsonValue.args = {
    ...Title.args,
    value: JSON.stringify({ a: 1, b: true }),
};

export const JsonIncludeObject = Template.bind({});
JsonIncludeObject.args = {
    ...Title.args,
    value: JSON.stringify({ a: 1, b: true, arr: { c: '2', d: null } }),
};

export const JsonIncludeManyArray = Template.bind({});
JsonIncludeManyArray.args = {
    ...Title.args,
    value: JSON.stringify({
        a: 1,
        b: true,
        arr: ['one', 'two', true, false, { c: '2', d: null }, ['nested', { e: 'string', f: 'wow' }]],
    }),
};

export const ShowArrayKey = Template.bind({});
ShowArrayKey.args = {
    showArrayKey: true,
    ...JsonIncludeManyArray.args,
};
