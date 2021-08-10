import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ObjectInputbox, ObjectInputboxProps } from '../src';

export default {
    title: 'suit-ui/ObjectInputbox',
    component: ObjectInputbox,
    argTypes: {
        backgroundColor: { control: 'color' },
        color: { control: 'color' },
        width: { control: 'text' },
    },
} as Meta;

const Template: Story<ObjectInputboxProps> = (args) => <ObjectInputbox {...args} />;

export const Default = Template.bind({});
Default.args = {};
