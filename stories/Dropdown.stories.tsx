import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Dropdown, DropdownProps, Flex } from '../src';

export default {
    title: 'suit-ui/Dropdown',
    component: Dropdown,
    decorators: [
        (Story) => (
            <div style={{ height: '50vh' }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        backgroundColor: { control: 'color' },
    },
    args: {
        size: 'medium',
    },
} as Meta;

const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />;

export const Items = Template.bind({});
Items.args = {
    label: 'Dropdown',
    items: Array(100)
        .fill(0)
        .map((_, idx) => idx),
};

export const VariableSize = ({ size, items, label, ...props }) => {
    return (
        <>
            <Dropdown size="xs" items={Items.args.items} {...props} label="Extra small" />
            <br />
            <Dropdown size="small" items={Items.args.items} {...props} label="Small" />
            <br />
            <Dropdown size="medium" items={Items.args.items} {...props} label="Medium" />
        </>
    );
};
VariableSize.argTypes = {
    label: { table: { disable: true } },
    items: { table: { disable: true } },
    size: { table: { disable: true } },
};

export const ItemCopy = Template.bind({});
ItemCopy.args = {
    ...Items.args,
    copy: true,
    copyTooltip: 'Copy Item',
};

export const Disable = Template.bind({});
Disable.args = {
    ...Items.args,
    disable: true,
};

export const Loading = Template.bind({});
Loading.args = {
    ...Items.args,
    loading: true,
};

export const LimitMaxHeight = Template.bind({});
LimitMaxHeight.args = {
    ...Items.args,
    label: 'Max height is 300px',
    maxItemsHeight: '300px',
};

export const SelectedItem = Template.bind({});
SelectedItem.args = {
    ...LimitMaxHeight.args,
    label: 'Selected item is 50',
    value: 50,
};

export const ThemeDark = Template.bind({});
ThemeDark.args = {
    ...SelectedItem.args,
    dark: true,
};
ThemeDark.parameters = {
    backgrounds: {
        default: 'dark',
    },
};

const MultipleTemplate: Story<DropdownProps> = (args) => (
    <>
        <Dropdown width="100%" {...args} />
        <Dropdown width="100%" {...args} />
        <Dropdown width="100%" {...args} />
    </>
);

export const ZIndex = MultipleTemplate.bind({});
ZIndex.args = {
    ...Items.args,
};

const MultipleWrappingTemplate: Story<DropdownProps> = (args) => (
    <>
        <Flex>
            <Dropdown width="100%" {...args} />
        </Flex>
        <Flex>
            <Dropdown width="100%" {...args} />
        </Flex>
        <Flex>
            <Dropdown width="100%" {...args} />
        </Flex>
    </>
);

export const ZIndexWithWrapping = MultipleWrappingTemplate.bind({});
ZIndexWithWrapping.args = {
    ...Items.args,
};
