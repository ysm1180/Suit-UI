/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { memo } from 'react';
import { BackgroundColorProps, borderColor, BorderColorProps, TextColorProps } from '../../common';
import { Box, Flex, Text } from '../../base';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import Switch from '../Switch/Switch';

interface SchedulerTableSmallTitleStyleProps {
    small: boolean;
}

const SchedulerTableTitle = styled(Box)<SchedulerTableSmallTitleStyleProps & BorderColorProps>`
    top: 0;
    max-height: 45px;
    margin-bottom: 8px;
    z-index: 20;

    ${(props) =>
        props.small && [
            css`
                position: sticky;
                margin-bottom: 0;
                max-height: 30px;
                border: 1px solid;
            `,
            borderColor(props),
        ]}
`;

interface Props {
    small?: boolean;
    compact?: boolean;
    onPreviosMonthClick?: () => void;
    onNextMonthClick?: () => void;
    onNowClick?: () => void;
    onCompactOptionChange?: (checked: boolean) => void;
}

export type SchedulerTitleProps = Props & BorderColorProps & BackgroundColorProps & TextColorProps;

const SchedulerTitle: React.FC<SchedulerTitleProps> = memo(
    ({
        children,
        small = false,
        compact = false,
        textColor,
        borderColor,
        backgroundColor,
        onPreviosMonthClick,
        onNextMonthClick,
        onNowClick,
        onCompactOptionChange,
    }) => {
        const onChange = (_: string, checked: boolean) => {
            onCompactOptionChange?.(checked);
        };

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[SchedulerTitle]', 'Rendered');
            console.log({
                children,
                small,
                compact,
                textColor,
                borderColor,
                backgroundColor,
                onPreviosMonthClick,
                onNextMonthClick,
                onNowClick,
                onCompactOptionChange,
            });
            console.groupEnd();
        }

        return (
            <SchedulerTableTitle small={small} borderColor={borderColor}>
                <Flex
                    position="relative"
                    px="10px"
                    py="4px"
                    backgroundColor={backgroundColor ?? 'white'}
                    justifyContent="space-between"
                >
                    <Flex>
                        <Button
                            size={small ? 'xs' : 'large'}
                            style={{ borderRadius: '50%' }}
                            backgroundColor={backgroundColor ?? 'transparent'}
                            onClick={onPreviosMonthClick}
                            textColor={textColor ?? 'black'}
                        >
                            <Icon icon={icons.regular.chevronLeft} />
                        </Button>
                        <Button
                            size={small ? 'xs' : 'large'}
                            style={{ borderRadius: '50%' }}
                            backgroundColor={backgroundColor ?? 'transparent'}
                            textColor={textColor ?? 'black'}
                            onClick={onNextMonthClick}
                        >
                            <Icon icon={icons.regular.chevronRight} />
                        </Button>

                        <Button
                            size={small ? 'xs' : 'large'}
                            backgroundColor={backgroundColor ?? 'transparent'}
                            textColor={textColor ?? 'black'}
                            onClick={onNowClick}
                        >
                            Today
                        </Button>
                    </Flex>
                    <Text textAlign="center" fontSize={small ? '13px' : '2em'} fontWeight="bold">
                        {children}
                    </Text>
                    <Flex alignItems="center">
                        <Switch
                            label="Compact"
                            onChange={onChange}
                            checked={compact}
                            size={small ? 'small' : 'medium'}
                            noAnimation={true}
                        />
                    </Flex>
                </Flex>
            </SchedulerTableTitle>
        );
    }
);

export default SchedulerTitle;
