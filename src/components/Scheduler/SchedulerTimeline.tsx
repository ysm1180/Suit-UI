import styled from '@emotion/styled';
import React, { useCallback, useMemo } from 'react';
import { backgroundColor, BackgroundColorProps, borderColor, BorderColorProps, ColorProps } from '../../common';
import { Box, Flex } from '../../base';
import { getContrast } from '../../utilities';
import { SchedulerTimelineData, SchedulerWeekData } from '../../types';
import SchedulerTimelineBox from './SchedulerTimelineBox';

const SchedulerTableDayItem = styled.div<ColorProps & BackgroundColorProps & BorderColorProps>`
    display: flex;
    flex: 1;

    border-right-width: 1px;
    border-right-style: solid;

    ${backgroundColor}

    ${borderColor}
`;

interface Props extends BackgroundColorProps, BorderColorProps {
    timelines: SchedulerTimelineData[];
    week: SchedulerWeekData;
    compactUI?: boolean;
    timelineColorFilter?: (category?: string) => string | undefined | null | false;
    onTimelineClick?: (key: string) => void;
}

const SchedulerTimeline: React.FC<Props> = React.memo(
    ({
        timelines,
        week,
        timelineColorFilter,
        onTimelineClick,
        compactUI = false,
        backgroundColor = 'white',
        borderColor,
    }) => {
        const isSelected = useMemo(() => {
            const selectedTimeline = timelines.find((timeline) => timeline.selected);
            return !!selectedTimeline;
        }, [timelines]);

        const isVisible = useMemo(() => {
            const visibleTimeline = timelines.filter((timeline) => timeline.visible);
            return visibleTimeline.length !== 0;
        }, [timelines]);

        const onClick = useCallback(
            (key: string) => {
                onTimelineClick?.(key);
            },
            [onTimelineClick]
        );

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SchedulerTimeline]', 'Rendered');
            console.log({
                timelines,
                week,
                timelineColorFilter,
                onTimelineClick,
                compactUI,
                backgroundColor,
                borderColor,
            });
            console.groupEnd();
        }

        return (
            <Box
                height={
                    isVisible ? (compactUI ? `${36 + (isSelected ? 7 : 0)}px` : `${53 + (isSelected ? 13 : 0)}px`) : 0
                }
            >
                {timelines.map((timeline) => {
                    const displayStartTime = new Date(timeline.start);
                    const displayEndTime = new Date(timeline.end);
                    let startDiff = displayStartTime.getTime() - week.startDay.getTime();
                    let endDiff = week.endDay.getTime() - displayEndTime.getTime();
                    startDiff = startDiff < 0 ? 0 : startDiff / 1000;
                    endDiff = endDiff < 0 ? 0 : endDiff / 1000;

                    const width = 100 - (100 / 7 / 24 / 60 / 60) * startDiff - (100 / 7 / 24 / 60 / 60) * endDiff;
                    const startLeft = (100 / 7 / 24 / 60 / 60) * startDiff;

                    return (
                        <SchedulerTimelineBox
                            key={`${timeline.key}`}
                            timeline={timeline}
                            widthRatio={width}
                            leftRatio={startLeft}
                            compactUI={compactUI}
                            backgroundColor={timelineColorFilter?.(timeline.category) || '#EEE'}
                            textColor={getContrast(timelineColorFilter?.(timeline.category) || '#EEE')}
                            onSelected={onClick}
                            selected={timeline.selected}
                            borderColor={backgroundColor}
                        />
                    );
                })}
                <Flex height="100%">
                    {week.days.map((day) => {
                        return (
                            <SchedulerTableDayItem
                                key={day.text}
                                color={day.current ? undefined : '#CCC'}
                                backgroundColor={day.now ? '#FBFEBE' : backgroundColor}
                                borderColor={borderColor}
                            />
                        );
                    })}
                </Flex>
            </Box>
        );
    },
    (prevProps, nextProps) => {
        return (
            JSON.stringify(prevProps.timelines) === JSON.stringify(nextProps.timelines) &&
            JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week) &&
            prevProps.compactUI === nextProps.compactUI &&
            prevProps.onTimelineClick === nextProps.onTimelineClick &&
            prevProps.timelineColorFilter === nextProps.timelineColorFilter &&
            prevProps.backgroundColor === nextProps.backgroundColor &&
            prevProps.borderColor === nextProps.borderColor
        );
    }
);

export default SchedulerTimeline;
