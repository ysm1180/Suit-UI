import styled from '@emotion/styled';
import { darken } from 'polished';
import React, { useCallback, useMemo } from 'react';
import { BackgroundColorProps, borderColor, BorderColorProps, ColorProps, useBreakpoints } from '../../common';
import { Box, Text } from '../../base';
import { SchedulerTimelineData } from '../../types/scheduler';

const SchedulerTimelineContainer = styled(Box)`
    position: absolute;
`;

const SchedulerTimelineBoxContainer = styled(Text)<BorderColorProps>`
    padding: 8px 0;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    border-right-width: 1px;
    border-right-style: solid;

    cursor: pointer;

    ${borderColor}
`;

const SchedulerTimelineText = styled(Text)`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding-left: 8px;
`;

interface Props {
    timeline: SchedulerTimelineData;
    widthRatio: number;
    leftRatio: number;
    compactUI?: boolean;
    selected?: boolean;
    onSelected?: (key: string) => void;
}

export type SchedulerTimelineBoxProps = Props & ColorProps & BackgroundColorProps & BorderColorProps;

const dateToString = (date: Date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const SchedulerTimelineBox: React.FC<SchedulerTimelineBoxProps> = React.memo(
    ({
        timeline,
        widthRatio,
        leftRatio,
        compactUI = false,
        selected = false,
        onSelected,
        textColor,
        backgroundColor = 'transparent',
        borderColor = 'white',
    }) => {
        const backgroundColorValue = useBreakpoints(backgroundColor);
        const onTimelineClick = useCallback(() => {
            onSelected?.(selected ? '' : timeline.key);
        }, [onSelected, selected, timeline.key]);

        const fontSize = useMemo(() => {
            let baseFontSize = 12;
            if (!compactUI) {
                baseFontSize += 2;
            }
            if (selected) {
                baseFontSize += 5;
            }

            return baseFontSize;
        }, [compactUI, selected]);

        const displayBackgroundColor = useMemo(() => {
            if (timeline.error) {
                return '#FF0000';
            }

            return selected ? darken(0.1, backgroundColorValue ?? 'transparent') : backgroundColorValue;
        }, [selected, backgroundColorValue, timeline.error]);

        const displayTitle = useMemo(() => {
            let title = `${timeline.text} ${dateToString(timeline.start)} ~ ${dateToString(timeline.end)}`;
            if (timeline.error) {
                title += ' 정보가 잘못되었습니다!!';
            }
            return title;
        }, [timeline.text, timeline.start, timeline.end, timeline.error]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SchedulerTimelineBox]', 'Rendered');
            console.log({
                timeline,
                widthRatio,
                leftRatio,
                compactUI,
                selected,
                onSelected,
                textColor,
                backgroundColor,
                borderColor,
            });
            console.groupEnd();
        }

        return (
            <SchedulerTimelineContainer
                width={`${widthRatio}%`}
                left={`${leftRatio}%`}
                display={`${timeline.visible ? 'block' : 'none'}`}
            >
                <SchedulerTimelineBoxContainer
                    fontSize={fontSize}
                    backgroundColor={displayBackgroundColor}
                    textColor={textColor}
                    title={displayTitle}
                    onClick={onTimelineClick}
                    borderColor={borderColor}
                >
                    <SchedulerTimelineText display={compactUI ? 'inline-block' : 'block'}>
                        {timeline.text} {timeline.error && '정보가 잘못되었습니다!!'}
                    </SchedulerTimelineText>
                    <SchedulerTimelineText display={compactUI ? 'inline-block' : 'block'} fontWeight="bold">
                        {`${dateToString(timeline.start)} ~ ${dateToString(timeline.end)}`}
                    </SchedulerTimelineText>
                </SchedulerTimelineBoxContainer>
            </SchedulerTimelineContainer>
        );
    },
    (prevProps, nextProps) => {
        return (
            JSON.stringify(prevProps.timeline) === JSON.stringify(nextProps.timeline) &&
            prevProps.widthRatio === nextProps.widthRatio &&
            prevProps.leftRatio === nextProps.leftRatio &&
            JSON.stringify(prevProps.backgroundColor) === JSON.stringify(nextProps.backgroundColor) &&
            JSON.stringify(prevProps.textColor) === JSON.stringify(nextProps.textColor) &&
            prevProps.compactUI === nextProps.compactUI &&
            prevProps.selected === nextProps.selected &&
            prevProps.onSelected === nextProps.onSelected &&
            prevProps.borderColor === nextProps.borderColor
        );
    }
);

export default SchedulerTimelineBox;
