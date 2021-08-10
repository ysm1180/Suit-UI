import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Button, ColorPicker, ColorPickerProps, ColorValues } from '../src';

export default {
    title: 'suit-ui/ColorPicker',
    component: ColorPicker,
    argTypes: {
        textColor: { control: 'color' },
    },
    args: {
        rgb: { r: 255, g: 255, b: 255 },
        textColor: 'black',
        showHex: true,
        showRGB: true,
    },
} as Meta;

const Template: Story<ColorPickerProps> = ({ ...args }) => <ColorPicker {...args} />;

export const Default = Template.bind({});
Default.args = {};

const HoverTemplate: Story<ColorPickerProps> = ({ ...args }) => {
    const [buttonColor, setButtonColor] = useState('#36A3FF');
    const [showColorPick, setShowColorPick] = useState(false);

    const onChange = (color: ColorValues) => {
        setButtonColor(color.hex);
    };

    const onClick = () => {
        setShowColorPick((s) => !s);
    };

    return (
        <div>
            <Button backgroundColor={buttonColor} onClick={onClick}>
                Color Pick
            </Button>
            {showColorPick && (
                <Box width="300px">
                    <ColorPicker {...args} onColorChange={onChange} />
                </Box>
            )}
        </div>
    );
};

export const ToggleColorPicker = HoverTemplate.bind({});
