import styled from '@emotion/styled';
import React from 'react';
import { borderColor, BorderColorProps, color, ColorProps } from '../../common';
import { SchedulerWeekData } from '../../types/scheduler';

const SchedulerTableRow = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;

    position: sticky;
    top: 75px;

    z-index: 9;
`;

const SchedulerTableContent = styled.div`
    display: flex;
    flex: 1;
`;

const SchedulerTableDayItem = styled.div<ColorProps & BorderColorProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    padding: 0.5em 0 0.5em 0;

    border-top: 1px solid;
    border-right: 1px solid;

    ${borderColor}

    font-size: 14px;

    ${color}
`;

interface Props {
    week: SchedulerWeekData;
}

type SchedulerWeekProps = Props & ColorProps & BorderColorProps;

const SchedulerWeek: React.FC<SchedulerWeekProps> = React.memo(
    ({ week, textColor, backgroundColor = 'white', borderColor }) => {
        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SchedulerWeek]', 'Rendered');
            console.log({
                week,
                color,
                backgroundColor,
                borderColor,
            });
            console.groupEnd();
        }

        return (
            <SchedulerTableRow key={week.startDay.toString()}>
                <SchedulerTableContent>
                    {week.days.map((day) => (
                        <SchedulerTableDayItem
                            key={day.text}
                            textColor={textColor}
                            backgroundColor={day.now ? '#FBFEBE' : backgroundColor}
                            borderColor={borderColor}
                        >
                            {day.text}
                        </SchedulerTableDayItem>
                    ))}
                </SchedulerTableContent>
            </SchedulerTableRow>
        );
    },
    (prevProps, nextProps) => {
        return (
            JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week) &&
            JSON.stringify(prevProps.textColor) === JSON.stringify(nextProps.textColor) &&
            prevProps.backgroundColor === nextProps.backgroundColor &&
            prevProps.borderColor === nextProps.borderColor
        );
    }
);

export default SchedulerWeek;
