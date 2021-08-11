import styled from '@emotion/styled';
import { throttle } from 'lodash-es';
import React, { useCallback, useRef } from 'react';
import { ColorFormats } from 'tinycolor2';
import { ChangeColorEvent } from '../../types';
import * as saturation from '../../utilities/color/saturation';

const SaturationContainer = styled.div<{ h: number }>`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: hsl(${(props) => props.h}, 100%, 50%);
`;

const SaturationWhite = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: -webkit-linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
`;

const SaturationBlack = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: -webkit-linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
`;

const PointerContainer = styled.div<{ v: number; s: number }>`
    position: absolute;
    top: ${(props) => -(props.v * 100) + 100}%;
    left: ${(props) => props.s * 100}%;
`;

const Circle = styled.div`
    width: 4px;
    height: 4px;
    box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    cursor: hand;
    transform: translate(-2px, -2px);
`;

export interface HueProps {
    hsl: ColorFormats.HSLA;
    hsv: ColorFormats.HSVA;
    onChange?: ChangeColorEvent;
}

const Saturation: React.FC<HueProps> = ({ hsl, hsv, onChange }) => {
    const ref = useRef<HTMLDivElement>(null);
    const throttled = useRef(
        throttle((fn: ChangeColorEvent | undefined, data, e) => {
            fn?.(data, e);
        }, 50)
    );

    const handleChange = useCallback(
        (e: MouseEvent) => {
            throttled.current(onChange, saturation.calculateChange(e, hsl, ref.current), e);
        },
        [hsl, onChange]
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
        console.group('[Saturation]', 'Rendered');
        console.log({ hsl, hsv, onChange });
        console.groupEnd();
    }

    return (
        <SaturationContainer h={hsl.h} ref={ref} onMouseDown={onMouseDown}>
            <SaturationWhite>
                <SaturationBlack>
                    <PointerContainer v={hsv.v} s={hsv.s}>
                        <Circle />
                    </PointerContainer>
                </SaturationBlack>
            </SaturationWhite>
        </SaturationContainer>
    );
};

export default Saturation;
