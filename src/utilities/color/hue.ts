import { ColorFormats } from 'tinycolor2';

export const calculateChange = (
    e: MouseEvent,
    direction: 'horizontal' | 'vertical',
    hsl: ColorFormats.HSLA,
    container: HTMLDivElement | null
) => {
    if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const x = e.pageX;
        const y = e.pageY;
        const left = x - (container.getBoundingClientRect().left + window.pageXOffset);
        const top = y - (container.getBoundingClientRect().top + window.pageYOffset);

        if (direction === 'vertical') {
            let h;
            if (top < 0) {
                h = 359;
            } else if (top > containerHeight) {
                h = 0;
            } else {
                const percent = -((top * 100) / containerHeight) + 100;
                h = (360 * percent) / 100;
            }

            if (hsl.h !== h) {
                return {
                    h,
                    s: hsl.s,
                    l: hsl.l,
                    a: hsl.a,
                    source: 'hsl',
                };
            }
        } else {
            let h;
            if (left < 0) {
                h = 0;
            } else if (left > containerWidth) {
                h = 359;
            } else {
                const percent = (left * 100) / containerWidth;
                h = (360 * percent) / 100;
            }

            if (hsl.h !== h) {
                return {
                    h,
                    s: hsl.s,
                    l: hsl.l,
                    a: hsl.a,
                    source: 'hsl',
                };
            }
        }
    }

    return null;
};
