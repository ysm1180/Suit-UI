import React, { useMemo } from 'react';
import { BackgroundColorProps, BorderColorProps } from '../../common';
import SchedulerTimeline from './SchedulerTimeline';
import { SchedulerTimelineData, SchedulerWeekData } from '../../types/scheduler';

interface Props {
    timelines: SchedulerTimelineData[];
    week: SchedulerWeekData;
    selectedTimelineKey?: string;
    compactUI?: boolean;
    timelineColorFilter?: (category?: string) => string | undefined | null | false;
    onTimelineClick?: (key: string) => void;
}

type SchedulerTimelinesProps = Props & BackgroundColorProps & BorderColorProps;

const SchedulerTimelines: React.FC<SchedulerTimelinesProps> = React.memo(
    ({
        timelines: weekTimelines,
        week,
        selectedTimelineKey,
        timelineColorFilter,
        onTimelineClick,
        compactUI = false,
        backgroundColor = 'white',
        borderColor,
    }) => {
        const timelinesOfLine = useMemo(() => {
            const categories = new Set(weekTimelines.map((timeline) => timeline.category));
            const finalTimelines: SchedulerTimelineData[][] = [];
            categories.forEach((category) => {
                const categoryTimelinesList: SchedulerTimelineData[][] = [];
                weekTimelines
                    .filter((timeline) => timeline.category === category)
                    .map((timeline) => ({ ...timeline, selected: timeline.key === selectedTimelineKey }))
                    .forEach((timeline) => {
                        const startDate = new Date(timeline.start);
                        let added = false;
                        for (const categoryTimelines of categoryTimelinesList) {
                            const item = categoryTimelines[categoryTimelines.length - 1] ?? null;
                            if (item) {
                                const itemEndDate = new Date(item.end);
                                if (itemEndDate <= startDate) {
                                    categoryTimelines.push(timeline);
                                    added = true;
                                    break;
                                }
                            }
                        }
                        if (!added) {
                            categoryTimelinesList.push([timeline]);
                        }
                    });
                finalTimelines.push(...categoryTimelinesList);
            });

            return finalTimelines;
        }, [weekTimelines, selectedTimelineKey]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SchedulerTimelines]', 'Rendered');
            console.log({
                weekTimelines,
                week,
                selectedTimelineKey,
                timelineColorFilter,
                onTimelineClick,
                compactUI,
                backgroundColor,
                borderColor,
            });
            console.groupEnd();
        }

        return (
            <div>
                {timelinesOfLine.map((timelines, index) => {
                    return (
                        <SchedulerTimeline
                            key={index}
                            timelines={timelines}
                            week={week}
                            timelineColorFilter={timelineColorFilter}
                            onTimelineClick={onTimelineClick}
                            compactUI={compactUI}
                            backgroundColor={backgroundColor}
                            borderColor={borderColor}
                        />
                    );
                })}
            </div>
        );
    },

    (prevProps, nextProps) => {
        return (
            JSON.stringify(prevProps.timelines) === JSON.stringify(nextProps.timelines) &&
            JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week) &&
            prevProps.selectedTimelineKey === nextProps.selectedTimelineKey &&
            prevProps.compactUI === nextProps.compactUI &&
            prevProps.onTimelineClick === nextProps.onTimelineClick &&
            prevProps.timelineColorFilter === nextProps.timelineColorFilter &&
            prevProps.backgroundColor === nextProps.backgroundColor &&
            prevProps.borderColor === nextProps.borderColor
        );
    }
);

export default SchedulerTimelines;
