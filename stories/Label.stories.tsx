import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Label, LabelProps } from '../src';

export default {
    title: 'suit-ui/Label',
    component: Label,
    argTypes: {
        color: { control: 'color' },
        titleColor: { control: 'color' },
    },
    args: {
        color: 'black',
        titleColor: 'black',
        fontSize: 13,
        titleFontSize: 15,
        copyTooltip: 'Copy',
    },
} as Meta;

const Template: Story<LabelProps & { children: React.ReactNode }> = ({ children, ...args }) => (
    <Label {...args}>{children}</Label>
);

export const Default = Template.bind({});
Default.args = {
    children: 'Label',
};

export const Title = ({ ...props }) => {
    props.margin = { x: 10 };

    return (
        <>
            <div>
                <Label title="Title" {...props}>
                    Label 1
                </Label>
            </div>
            <br />
            <div>
                <Label title="Inline title" line={true} {...props}>
                    Label 2
                </Label>
            </div>
        </>
    );
};

export const Color = Template.bind({});
Color.args = {
    title: 'Custom color',
    titleColor: 'red',
    color: 'orange',
    children: 'label',
};
