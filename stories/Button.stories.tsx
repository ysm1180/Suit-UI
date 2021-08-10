import { Meta, Story } from '@storybook/react';
import React, { ReactNode } from 'react';
import { Button, ButtonProps, Flex, Icon, icons } from '../src';

export default {
    title: 'suit-ui/Button',
    component: Button,
    argTypes: {
        color: { control: 'color' },
        backgroundColor: { control: 'color' },
        hoverTextColor: { control: 'color' },
        hoverBackgroundColor: { control: 'color' },
        activeTextColor: { control: 'color' },
        activeBackgroundColor: { control: 'color' },
        disabledBackgroundColor: { control: 'color' },
        borderColor: { control: 'color' },
    },
    args: {
        color: 'white',
        backgroundColor: '#36A3FF',
    },
} as Meta;

const Template: Story<ButtonProps & { children: ReactNode }> = ({ children, ...args }) => (
    <Button {...args}>{children}</Button>
);

export const Default = Template.bind({});
Default.args = {
    children: 'Button',
};

export const VariableSize = ({ size, ...props }) => {
    props.margin = { x: 10 };

    return (
        <>
            <Button size="xs" {...props}>
                Extra small
            </Button>
            <Button size="sm" {...props}>
                Small
            </Button>
            <Button size="md" {...props}>
                Medium
            </Button>
            <Button size="lg" {...props}>
                Large
            </Button>
            <Button size="xl" {...props}>
                Extra large
            </Button>
            <Button width="100%" height="100px" fontSize="25px" {...props} margin={0}>
                Custom Size
            </Button>
        </>
    );
};
VariableSize.argTypes = {
    size: { table: { disable: true } },
    margin: { table: { disable: true } },
};

export const CustomColor = Template.bind({});
CustomColor.args = {
    ...Default.args,
    color: 'white',
    backgroundColor: 'black',
    hoverTextColor: 'white',
    hoverBackgroundColor: '#666',
    activeTextColor: 'black',
    activeBackgroundColor: '#EEE',
};

export const IconButton = Template.bind({});
IconButton.args = {
    ...Default.args,
    children: <Icon icon={icons.regular.plus} />,
};

export const Loading = Template.bind({});
Loading.args = {
    ...Default.args,
    loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    ...Default.args,
    disabled: true,
};

export const Title = ({ size, ...props }) => {
    props.margin = { x: 10 };
    return (
        <>
            <Button size="xs" {...props}>
                Extra small
            </Button>
            <Button size="sm" {...props}>
                Small
            </Button>
            <Button size="md" {...props}>
                Medium
            </Button>
            <Button size="lg" {...props}>
                Large
            </Button>
            <Button size="xl" {...props}>
                Extra large
            </Button>
        </>
    );
};
Title.args = {
    ...Default.args,
    title: 'It is title',
};
Title.argTypes = {
    size: { table: { disable: true } },
    margin: { table: { disable: true } },
};
