import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Inputbox, InputboxProps } from '../src';

export default {
    title: 'suit-ui/Inputbox',
    component: Inputbox,
} as Meta;

const Template: Story<InputboxProps> = (args) => <Inputbox {...args} />;

export const Label = ({ label, ...props }) => {
    return (
        <>
            <Inputbox label="Label" {...props}></Inputbox>
            <Inputbox inline={true} label="Inline Label" {...props}></Inputbox>
        </>
    );
};
Label.argTypes = {
    label: { table: { disable: true } },
};

export const VariableSize = ({ size, label, ...props }) => {
    props.margin = { x: 10 };

    return (
        <div>
            <Inputbox size="xs" label="Extra small" {...props}></Inputbox>
            <Inputbox size="sm" label="Small" {...props}></Inputbox>
            <Inputbox size="md" label="Medium" {...props}></Inputbox>
            <Inputbox width="100%" label="Full width (100%)" {...props} margin={0}></Inputbox>
        </div>
    );
};
VariableSize.argTypes = {
    size: { table: { disable: true } },
    label: { table: { disable: true } },
    margin: { table: { disable: true } },
};

export const CustomColor = Template.bind({});
CustomColor.args = {
    label: 'Custom color',
    backgroundColor: '#333',
    color: 'white',
};

export const UseBaseInputType = ({ ...props }) => {
    props.margin = { x: 10 };

    return (
        <div>
            <Inputbox type="password" label="Password" {...props}></Inputbox>
            <Inputbox label="Number (1 ~ 100)" type="number" min={1} max={100} {...props}></Inputbox>
        </div>
    );
};

UseBaseInputType.argTypes = {
    type: { table: { disable: true } },
    label: { table: { disable: true } },
    margin: { table: { disable: true } },
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    label: 'Read only',
    readOnly: true,
    defaultValue: 'Disabled!',
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
    label: 'Label',
    defaultValue: 'Default',
};

export const Copy = Template.bind({});
Copy.args = {
    label: 'Copy',
    copy: true,
    defaultValue: 'Click Copy Icon!!',
};

const DropTemplate: Story<InputboxProps> = (args) => {
    const onDragStart = (e: React.DragEvent) => {
        const data = e.currentTarget.getAttribute('data-drop');
        if (data) {
            e.dataTransfer.setData('data', data);
        }
    };
    return (
        <div>
            <div draggable={true} onDragStart={onDragStart} data-drop="COMPLETE">
                DRAG ME!
            </div>
            <Inputbox {...args} />
        </div>
    );
};

export const AllowDrop = DropTemplate.bind({});
AllowDrop.args = {
    label: '"data-drop" value is "COMPLETE"',
    allowDrop: true,
};

export const ShowListItems = Template.bind({});
ShowListItems.args = {
    label: 'Click box and show list!',
    showList: true,
    listItems: ['리스트1', '리스트2'],
};

export const PassCustomArgsToOnValueChange = Template.bind({});
PassCustomArgsToOnValueChange.args = {
    label: 'Check OnValueChange Action!',
    args: ['one', 1, 'two', 2],
};
