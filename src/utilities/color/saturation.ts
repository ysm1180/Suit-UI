import { ColorFormats } from 'tinycolor2';

export const calculateChange = (e: MouseEvent, hsl: ColorFormats.HSLA, container: HTMLDivElement | null) => {
    if (container) {
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        const x = e.pageX;
        const y = e.pageY;
        let left = x - (container.getBoundingClientRect().left + window.pageXOffset);
        let top = y - (container.getBoundingClientRect().top + window.pageYOffset);

        if (left < 0) {
            left = 0;
        } else if (left > containerWidth) {
            left = containerWidth;
        }

        if (top < 0) {
            top = 0;
        } else if (top > containerHeight) {
            top = containerHeight;
        }

        const saturation = left / containerWidth;
        const bright = 1 - top / containerHeight;

        return {
            h: hsl.h,
            s: saturation,
            v: bright,
            a: hsl.a,
            source: 'hsv',
        };
    }
};
