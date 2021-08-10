/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useRef } from 'react';
import { ColorFormats } from 'tinycolor2';
import { Box } from '../../base';
import { ChangeColorEvent } from '../../types/colorpicker';
import * as hue from '../../utilities/color/hue';

const HueHorizontal = styled.div`
    position: relative;
    height: 100%;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    background: -webkit-linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
`;

const HueVertical = styled.div`
    position: relative;
    height: 100%;
    background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
`;

interface SliderContainerStyleProps {
    h: number;
    vertical: boolean;
}

const SliderContainer = styled.div<SliderContainerStyleProps>`
    position: absolute;
    left: ${(props) => (props.h * 100) / 360}%;

    ${(props) =>
        props.vertical &&
        css`
            left: 0px;
            top: ${-((props.h * 100) / 360) + 100}%;
        `};
`;

const Slider = styled.div`
    margin-top: 1px;
    width: 4px;
    border-radius: 1px;
    height: 14px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
    background: #fff;
    transform: translateX(-2px);
`;

export interface HueProps {
    direction: 'horizontal' | 'vertical';
    hsl: ColorFormats.HSLA;
    onChange?: ChangeColorEvent;
}

const Hue: React.FC<HueProps> = ({ direction, hsl, onChange }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
        (e: MouseEvent) => {
            const change = hue.calculateChange(e, direction, hsl, ref.current);
            change && onChange?.(change, e);
        },
        [direction, hsl, onChange]
    );

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            handleChange(e.nativeEvent);

            const onMouseUp = () => {
                window.removeEventListener('mousemove', handleChange);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', handleChange);
            window.addEventListener('mouseup', onMouseUp);
        },
        [handleChange]
    );

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[Hue]', 'Rendered');
        console.log({ direction, hsl, onChange });
        console.groupEnd();
    }

    return (
        <Box position="absolute" top={0} left={0} bottom={0} right={0}>
            {direction === 'horizontal' ? (
                <HueHorizontal ref={ref} onMouseDown={onMouseDown}>
                    <SliderContainer h={hsl.h} vertical={false}>
                        <Slider></Slider>
                    </SliderContainer>
                </HueHorizontal>
            ) : (
                <HueVertical ref={ref} onMouseDown={onMouseDown}>
                    <SliderContainer h={hsl.h} vertical={true}>
                        <Slider></Slider>
                    </SliderContainer>
                </HueVertical>
            )}
        </Box>
    );
};

export default Hue;
