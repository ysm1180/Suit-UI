import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { ColorFormats } from 'tinycolor2';
import { Button, Inputbox } from '../..';
import { Box, Flex } from '../../base';
import { TextColorProps, WidthProps } from '../../common';
import { ChangeColorEvent, ColorValues } from '../../types';
import { isValidHex, toColorFormats } from '../../utilities/color/color';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import Hue from './Hue';
import Saturation from './Saturation';

const DisplayColorContainer = styled.div`
    width: 16px;
    height: 16px;
    position: relative;
    margin-left: 8px;
    border: 1px solid black;
    box-sizing: border-box;
`;

interface ActiveColorStyleProps {
    rgb: ColorFormats.RGB;
}

const ActiveColor = styled.div<ActiveColorStyleProps>`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: ${(props) => `rgba(${props.rgb.r}, ${props.rgb.g}, ${props.rgb.b}, 1)`};
`;

export type ColorPickerProps = {
    rgb?: ColorFormats.RGB;
    hex?: string;
    onColorChange?: (color: ColorValues) => void;
    onCancel?: (original: ColorValues) => void;
    onOK?: (color: ColorValues) => void;
    showHex?: boolean;
    showRGB?: boolean;
    showCancel?: boolean;
    showOK?: boolean;
} & WidthProps &
    TextColorProps;

const ColorPicker: React.FC<ColorPickerProps> = ({
    width,
    hex,
    rgb = { r: 255, g: 255, b: 255 },
    onColorChange,
    onOK,
    onCancel,
    showHex = true,
    showRGB = true,
    showCancel = false,
    showOK = false,
    textColor = 'black',
}) => {
    const [selectedColor, setSelectedColor] = useState({ ...toColorFormats(hex ?? rgb) });

    const onOKClick = useCallback(() => {
        onOK?.(selectedColor);
    }, [selectedColor, onOK]);

    const onCancelClick = useCallback(() => {
        const original = { ...toColorFormats(hex ?? rgb) };
        onCancel?.(original);
    }, [hex, rgb, onCancel]);

    const onChange: ChangeColorEvent = useCallback(
        (data) => {
            const colors = toColorFormats(data, data.h);
            setSelectedColor(colors);
            onColorChange?.(colors);
        },
        [onColorChange]
    );

    const onHexChange = (value: string) => {
        if (isValidHex(value)) {
            const colors = toColorFormats(`#${value}`);
            setSelectedColor(colors);
            onColorChange?.(colors);
        }
    };

    const onRGBChange = (value: string, ...args: unknown[]) => {
        const rgbType = args[0] as string;
        const colorValue = Number(value);
        if (colorValue >= 0 && colorValue <= 255) {
            const colors = toColorFormats({ ...selectedColor.rgb, [rgbType]: colorValue });
            setSelectedColor(colors);
            onColorChange?.(colors);
        }
    };

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[ColorPicker]', 'Rendered');
        console.log({
            width,
            hex,
            rgb,
            onColorChange,
            onOK,
            onCancel,
            showHex,
            showRGB,
            showCancel,
            showOK,
            textColor,
        });
        console.groupEnd();
    }

    return (
        <Box width={width} padding="10px">
            {showCancel && (
                <Flex flexDirection="row-reverse">
                    <Button size="xs" onClick={onCancelClick} backgroundColor="transparent" textColor={textColor}>
                        <Icon icon={icons.regular.close} />
                    </Button>
                </Flex>
            )}
            <Box position="relative" width="100%" height="100px" mb="8px">
                <Saturation hsl={selectedColor.hsl} hsv={selectedColor.hsv} onChange={onChange} />
            </Box>
            <Flex>
                <Box position="relative" height="16px" style={{ flex: '1' }}>
                    <Hue direction="horizontal" hsl={selectedColor.hsl} onChange={onChange} />
                </Box>
                <DisplayColorContainer>
                    <ActiveColor rgb={selectedColor.rgb} />
                </DisplayColorContainer>
            </Flex>
            {(showHex || showRGB) && (
                <Flex mt="8px">
                    {showHex && (
                        <Flex flexGrow={1} flexShrink={1} flexBasis="0">
                            <Inputbox
                                size="xs"
                                label="Hex"
                                defaultValue={selectedColor.hex.replace('#', '')}
                                onValueChange={onHexChange}
                                textColor={textColor}
                            />
                        </Flex>
                    )}
                    {showRGB && (
                        <>
                            <Flex flexGrow={1} flexShrink={1} flexBasis="0">
                                <Inputbox
                                    size="xs"
                                    label="R"
                                    defaultValue={`${selectedColor.rgb.r}`}
                                    args={['r']}
                                    onValueChange={onRGBChange}
                                    textColor={textColor}
                                />
                            </Flex>
                            <Flex flexGrow={1} flexShrink={1} flexBasis="0">
                                <Inputbox
                                    size="xs"
                                    label="G"
                                    defaultValue={`${selectedColor.rgb.g}`}
                                    args={['g']}
                                    onValueChange={onRGBChange}
                                    textColor={textColor}
                                />
                            </Flex>
                            <Flex flexGrow={1} flexShrink={1} flexBasis="0">
                                <Inputbox
                                    size="xs"
                                    label="B"
                                    defaultValue={`${selectedColor.rgb.b}`}
                                    args={['b']}
                                    onValueChange={onRGBChange}
                                    textColor={textColor}
                                />
                            </Flex>
                        </>
                    )}
                    {showOK && (
                        <Flex>
                            <Button size="xs" backgroundColor="transparent" textColor={textColor} onClick={onOKClick}>
                                OK
                            </Button>
                        </Flex>
                    )}
                </Flex>
            )}
        </Box>
    );
};

export default ColorPicker;
