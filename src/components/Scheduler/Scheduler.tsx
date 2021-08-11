import styled from '@emotion/styled';
import React, { useCallback, useMemo, useState } from 'react';
import {
    BackgroundColorProps,
    borderColor,
    BorderColorProps,
    ColorProps,
    HeightProps,
    TextColorProps,
} from '../../common';
import { Flex } from '../../base';
import { SchedulerDayData, SchedulerTimelineData, SchedulerWeekData } from '../../types';
import SchedulerTableHeader from './SchedulerTableHeader';
import SchedulerTimelines from './SchedulerTimelines';
import SchedulerTitle from './SchedulerTitle';
import SchedulerWeek from './SchedulerWeek';

const SchedulerTableContainer = styled(Flex)`
    overflow: auto;
`;

const SchedulerTable = styled(Flex)<ColorProps & BorderColorProps>`
    box-sizing: border-box;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;

    flex-direction: column;

    border: 1px solid;
    border-right: 0;

    ${borderColor}
`;

const SchedulerTableRow = styled(Flex)`
    position: relative;
    flex: 1;
    flex-direction: column;
`;

interface Props {
    timelines?: SchedulerTimelineData[];
    timelineColorFilter?: (category?: string) => string | undefined | null | false;
    onTimelineClick?: (key?: string) => void;
    onCompactChange?: (compact: boolean) => void;
    compactTimeline?: boolean;
    headerBackgroundColor?: string;
    calenderBackgroundColor?: string;
    initcompactTimeline?: boolean;
}

export type SchedulerProps = Props & HeightProps & TextColorProps & BorderColorProps & BackgroundColorProps;
const Scheduler: React.FC<SchedulerProps> = React.memo(
    ({
        timelines = [],
        timelineColorFilter,
        onTimelineClick,
        onCompactChange,
        headerBackgroundColor = '#F3F4F5',
        backgroundColor,
        calenderBackgroundColor = 'white',
        borderColor = '#d8d9da',
        textColor,
        height,
        initcompactTimeline = false,
    }) => {
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [compactUI, setCompactUI] = useState(initcompactTimeline);
        const [smallTitle, setSmallTitle] = useState(false);
        const [rectTop, setRectTop] = useState(0);
        const [selectedTimelineKey, setSelectedTimelineKey] = useState('');
        const displayDate = useMemo(() => {
            return `${currentMonth.getFullYear()} / ${currentMonth.getMonth() + 1}`;
        }, [currentMonth]);

        const getComputedDays = useCallback((currentMonth: Date) => {
            const previousLastDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
            const firstDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const lastDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            const month = [];
            let days: SchedulerDayData[] = [];
            let dayCount = 0;
            const firstDayOfWeek = firstDate.getDay();
            let startDayOfWeek = new Date(previousLastDate);
            startDayOfWeek.setDate(previousLastDate.getDate() - firstDayOfWeek + 1);
            for (let i = 0; i < firstDayOfWeek; i++) {
                days.push({ text: `${previousLastDate.getDate() - (firstDayOfWeek - i) + 1}`, current: false });
                dayCount += 1;
            }

            const now = new Date();
            let endDayOfWeek: Date;
            for (let i = 1; i <= lastDate.getDate(); i++) {
                if (dayCount !== 0 && dayCount % 7 === 0) {
                    endDayOfWeek = new Date(firstDate);
                    endDayOfWeek.setDate(i);
                    month.push({ days, startDay: startDayOfWeek, endDay: endDayOfWeek, week: month.length });
                    days = [];
                    startDayOfWeek = new Date(firstDate);
                    startDayOfWeek.setDate(i);
                }
                days.push({
                    text: i.toString(),
                    current: true,
                    now:
                        currentMonth.getFullYear() === now.getFullYear() &&
                        currentMonth.getMonth() === now.getMonth() &&
                        now.getDate() === i,
                });
                dayCount += 1;
            }

            let newDay = 1;
            endDayOfWeek = new Date(lastDate);
            endDayOfWeek.setDate(endDayOfWeek.getDate() + (7 - days.length) + 1);
            for (let i = days.length; i < 7; i++) {
                days.push({ text: newDay.toString(), current: false });
                newDay += 1;
            }
            month.push({ days, startDay: startDayOfWeek, endDay: endDayOfWeek, week: month.length });
            return month;
        }, []);

        const monthOfWeeks = useMemo<SchedulerWeekData[]>(
            () => getComputedDays(currentMonth),
            [currentMonth, getComputedDays]
        );

        const onScroll = useCallback(
            (e: React.UIEvent<HTMLElement>) => {
                if (!smallTitle && e.currentTarget.scrollTop > rectTop + 38) {
                    setSmallTitle(true);
                } else if (smallTitle && e.currentTarget.scrollTop <= rectTop) {
                    setSmallTitle(false);
                }
            },
            [rectTop, smallTitle]
        );

        const schedulerRef = useCallback((node: HTMLDivElement) => {
            if (node !== null) {
                setRectTop(node.offsetTop);
            }
        }, []);

        const onPreviosMonthClick = useCallback(() => {
            const previousDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
            setCurrentMonth(previousDate);
        }, [currentMonth]);

        const onNextMonthClick = useCallback(() => {
            const nextDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
            setCurrentMonth(nextDate);
        }, [currentMonth]);

        const onNowClick = useCallback(() => {
            const now = new Date();
            setCurrentMonth(now);
        }, []);

        const displayTimelines = useMemo(
            () =>
                timelines
                    .filter((timeline) => {
                        if (timeline.start > timeline.end) {
                            return false;
                        }

                        const previousMonth = new Date(timeline.start.getFullYear(), timeline.start.getMonth(), 0);
                        previousMonth.setDate(previousMonth.getDate() - 7);
                        if (previousMonth > timeline.end) {
                            return false;
                        }

                        const nextMonth = new Date(timeline.start.getFullYear(), timeline.start.getMonth() + 1, 1);
                        nextMonth.setDate(nextMonth.getDate() + 7);
                        if (nextMonth < timeline.start) {
                            return false;
                        }

                        return true;
                    })
                    .sort((a, b) => {
                        if (a.order && b.order && a.order !== b.order) {
                            return a.order - b.order;
                        }

                        if (a.category && b.category) {
                            if (a.category !== b.category) {
                                return a.category.localeCompare(b.category);
                            }
                        }

                        if (b.start.getTime() === a.start.getTime()) {
                            return a.end.getTime() - b.end.getTime();
                        }
                        return a.start.getTime() - b.start.getTime();
                    }),
            [timelines]
        );

        const weekTimelines = useMemo(() => {
            return monthOfWeeks.map((week) => {
                return displayTimelines.filter((timeline) => {
                    if (
                        (timeline.start > week.startDay && timeline.start > week.endDay) ||
                        (timeline.end < week.startDay && timeline.end < week.endDay)
                    ) {
                        return false;
                    }

                    return true;
                });
            });
        }, [monthOfWeeks, displayTimelines]);

        const onCompactCheckChange = useCallback(
            (checked: boolean) => {
                setCompactUI(checked);
                onCompactChange?.(checked);
            },
            [onCompactChange]
        );

        const onTimelineClickEvent = useCallback(
            (key: string) => {
                setSelectedTimelineKey(key);
                onTimelineClick?.(key);
            },
            [onTimelineClick]
        );

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Scheduler]', 'Rendered');
            console.log({
                timelines,
                timelineColorFilter,
                onTimelineClick,
                onCompactChange,
                headerBackgroundColor,
                backgroundColor,
                calenderBackgroundColor,
                borderColor,
                textColor,
                height,
                initcompactTimeline,
            });
            console.groupEnd();
        }

        return (
            <SchedulerTableContainer ref={schedulerRef} onScroll={onScroll} flexDirection="column" height={height}>
                <SchedulerTitle
                    small={smallTitle}
                    compact={compactUI}
                    borderColor={borderColor}
                    textColor={textColor}
                    backgroundColor={backgroundColor}
                    onPreviosMonthClick={onPreviosMonthClick}
                    onNextMonthClick={onNextMonthClick}
                    onNowClick={onNowClick}
                    onCompactOptionChange={onCompactCheckChange}
                >
                    {displayDate}
                </SchedulerTitle>

                <div>
                    <SchedulerTable width="100%" borderColor={borderColor}>
                        <SchedulerTableHeader backgroundColor={headerBackgroundColor} />
                        {monthOfWeeks.map((week, weekNumber) => {
                            return (
                                <SchedulerTableRow key={week.startDay.toString()}>
                                    <SchedulerWeek
                                        week={week}
                                        textColor={textColor}
                                        backgroundColor={calenderBackgroundColor}
                                        borderColor={borderColor}
                                    />
                                    <SchedulerTimelines
                                        timelines={weekTimelines[weekNumber]}
                                        week={week}
                                        selectedTimelineKey={
                                            weekTimelines[weekNumber].find(
                                                (timeline) => timeline.key === selectedTimelineKey
                                            )
                                                ? selectedTimelineKey
                                                : undefined
                                        }
                                        timelineColorFilter={timelineColorFilter}
                                        onTimelineClick={onTimelineClickEvent}
                                        compactUI={compactUI}
                                        backgroundColor={calenderBackgroundColor}
                                        borderColor={borderColor}
                                    />
                                </SchedulerTableRow>
                            );
                        })}
                    </SchedulerTable>
                </div>
            </SchedulerTableContainer>
        );
    }
);

export default Scheduler;
