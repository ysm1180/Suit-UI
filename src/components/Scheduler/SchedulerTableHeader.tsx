import styled from '@emotion/styled';
import React from 'react';
import { backgroundColor, BackgroundColorProps } from '../../common';
import { Flex } from '../../base';

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

const SchedulerTableHeaderContainer = styled(Flex)<BackgroundColorProps>`
    position: sticky;
    display: flex;
    top: 24px;
    flex: 1;
    flex-direction: column;
    z-index: 10;

    ${backgroundColor}
`;

const SchedulerTableDigit = styled.div`
    display: flex;
    justify-content: center;
    letter-spacing: -1px;
    flex: 1;
    border-right: 1px solid #d8d9da;
`;

const SchedulerTableHeaderItem = styled.div`
    display: flex;
    padding: 0.5em 0 0.5em 0;
    align-items: center;
    justify-content: center;
    flex: 1;

    border-right: 1px solid #d8d9da;
    font-weight: bold;
`;

const SchedulerTableHeaderContent = styled.div`
    display: flex;
    flex: 1;
    font-size: 9px;
`;

const SchedulerTableHeader: React.FC<BackgroundColorProps> = React.memo(({ backgroundColor }) => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[SchedulerTableHeader]', 'Rendered');
        console.log({
            backgroundColor,
        });
        console.groupEnd();
    }

    return (
        <SchedulerTableHeaderContainer backgroundColor={backgroundColor}>
            <Flex>
                {dayNames.map((dayName) => {
                    return (
                        <Flex flexDirection="column" flexGrow={1} key={dayName}>
                            <SchedulerTableHeaderItem>{dayName}</SchedulerTableHeaderItem>
                            <Flex style={{ borderTop: '1px solid #dad9d8' }}>
                                <SchedulerTableHeaderContent>
                                    {[0, 4, 8, 12, 16, 20].map((hour) => {
                                        return (
                                            <SchedulerTableDigit key={hour}>
                                                {hour} - {hour + 3}
                                            </SchedulerTableDigit>
                                        );
                                    })}
                                </SchedulerTableHeaderContent>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </SchedulerTableHeaderContainer>
    );
});

export default SchedulerTableHeader;
