import { default as tinycolor, ColorInput } from 'tinycolor2';
import colorNames from 'color-name';

export const getContrast = (color: string) => {
    const colors = colorNames as { [key: string]: [number, number, number] };
    if (colors[color]) {
        const [red, green, blue] = colors[color];
        if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
            return 'black';
        } else {
            return 'white';
        }
    }

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
        const red = parseInt(result[1], 16);
        const green = parseInt(result[2], 16);
        const blue = parseInt(result[3], 16);
        if (red * 0.299 + green * 0.587 + blue * 0.114 > 149) {
            return 'black';
        } else {
            return 'white';
        }
    }

    return 'black';
};

export const toColorFormats = (data: ColorInput, oldHue?: number) => {
    const color = tinycolor(data);
    const hsl = color.toHsl();
    const hsv = color.toHsv();
    const rgb = color.toRgb();
    const hex = color.toHex();
    if (hsl.s === 0) {
        hsl.h = oldHue || 0;
        hsv.h = oldHue || 0;
    }
    const transparent = rgb.a === 0;

    return {
        hsl,
        hex: transparent ? 'transparent' : `#${hex}`,
        rgb,
        hsv,
    };
};

export const isValidHex = (hex: string) => {
    if (hex === 'transparent') {
        return true;
    }

    const lh = String(hex).charAt(0) === '#' ? 1 : 0;
    return hex.length !== 4 + lh && hex.length < 7 + lh && tinycolor(hex).isValid();
};
