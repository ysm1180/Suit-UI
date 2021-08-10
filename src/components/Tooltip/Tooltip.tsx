import styled from '@emotion/styled';
import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { fontSize, FontSizeProps, padding, PaddingProps, textColor, TextColorProps } from '../../common';

interface TooltipContainerStyleProps {
    left: number;
    top: number;
}

const TooltipContainer = styled.div<TooltipContainerStyleProps>`
    position: absolute;

    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    width: max-content;
    max-width: 800px;
    z-index: 100;

    top: 0px;
    left: 0px;
    transform: ${(props) => `translate3d(${props.left}px, ${props.top}px, 0px)`};
`;

const TooltipContent = styled.div<PaddingProps>`
    ${padding}
`;

interface TooltipArrowStyleProps {
    left: number;
}

const TooltipArrow = styled.span<TooltipArrowStyleProps>`
    position: absolute;
    width: 3em;
    height: 1em;
    font-size: 7px;
    left: ${(props) => props.left}px;
    top: 0;
    margin-top: -1em;

    &::before {
        content: '';
        margin: auto;
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        border-width: 0 1em 1em 1em;
        border-style: solid;
        border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
    }
`;

const TooltipTitle = styled.div<TextColorProps>`
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;

    ${textColor}
`;

const TooltipText = styled.div<FontSizeProps>`
    font-size: 13px;
    font-weight: normal;
    color: white;
    line-height: 1.5;

    ${fontSize}
`;

export interface TooltipInnerProps {
    id?: string;
    container?: Element;
    target?: Element | null;
    title?: string;
    titleTextColor?: string;
    delay?: number;
    toggle?: 'click' | 'hover' | 'none';
    placement?: 'top' | 'left' | 'right' | 'bottom';
    distance?: {
        x?: number;
        y?: number;
    };
}

export type TooltipProps = TooltipInnerProps & FontSizeProps & PaddingProps;

const Tooltip: React.FC<TooltipProps> = memo(
    ({
        id,
        container = document.body,
        target,
        title = '',
        toggle = 'hover',
        placement = 'bottom',
        children,
        titleTextColor,
        delay = 0,
        distance = { x: 0, y: 5 },
        fontSize,
        padding = '5px',
    }) => {
        const [showState, setShowState] = useState(false);
        const [targetRect, setTargetRect] = useState<DOMRect>();
        const [contentRect, setContentRect] = useState<DOMRect>();
        const [animationStyle, setAnimationStyle] = useState<CSSProperties>({
            opacity: 0,
            transition: 'opacity 0.5s ease',
        });

        const setTooltipRef = useCallback((el: HTMLDivElement | null) => {
            const rect = el?.getBoundingClientRect();
            if (rect) {
                setContentRect(rect);
            }

            if (el !== null) {
                setTimeout(() => {
                    setAnimationStyle({
                        opacity: 1,
                        transition: 'opacity 0.5s ease',
                    });
                }, 100);
            } else {
                setAnimationStyle({
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                });
            }
        }, []);

        const showTooltip = useCallback(() => {
            const targetRect = target?.getBoundingClientRect();
            if (targetRect) {
                setTargetRect(targetRect);
            }

            setShowState(true);
        }, [target]);

        const showX = useMemo(
            () =>
                (targetRect?.x ?? 0) +
                (targetRect?.width ?? 0) / 2 -
                (placement !== 'left' && placement !== 'right' ? (contentRect?.width ?? 0) / 2 : 0) +
                (distance?.x ?? 0),
            [distance.x, targetRect, contentRect, placement]
        );

        const showY = useMemo(
            () =>
                (targetRect?.y ?? 0) +
                (targetRect?.height ?? 0) -
                (placement !== 'bottom' && placement !== 'top' ? (contentRect?.height ?? 0) / 2 : 0) +
                (distance?.y ?? 0),
            [distance.y, targetRect, contentRect, placement]
        );

        useEffect(() => {
            if (target) {
                let showTimeout: NodeJS.Timeout;
                const mouseOverEventHandler = (e: Event) => {
                    showTimeout = setTimeout(() => {
                        showTooltip();
                    }, delay);
                };
                const mouseLeaveEventHandler = (e: Event) => {
                    clearTimeout(showTimeout);
                    setShowState(false);
                };
                const keyLeaveEventHandler = (e: KeyboardEvent) => {
                    if (e.key === 'Escape') {
                        clearTimeout(showTimeout);
                        setShowState(false);
                    }
                };

                target.addEventListener('mouseover', mouseOverEventHandler);
                target.addEventListener('mouseleave', mouseLeaveEventHandler);
                target.addEventListener('focus', mouseOverEventHandler);
                target.addEventListener('blur', mouseLeaveEventHandler);
                target.addEventListener('keydown', keyLeaveEventHandler as (e: Event) => void);

                return () => {
                    setShowState(false);

                    target.removeEventListener('mouseover', mouseOverEventHandler);
                    target.removeEventListener('mouseleave', mouseLeaveEventHandler);
                    target.removeEventListener('focus', mouseOverEventHandler);
                    target.removeEventListener('blur', mouseLeaveEventHandler);
                    target.removeEventListener('keydown', keyLeaveEventHandler as (e: Event) => void);
                };
            }
        }, [target, showTooltip, delay]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Tooltip]', 'Rendered');
            console.log({
                id,
                target,
                title,
                toggle,
                placement,
                children,
                titleTextColor,
                delay,
                distance,
                fontSize,
                padding,
            });
            console.groupEnd();
        }

        return createPortal(
            showState && (
                <TooltipContainer style={animationStyle} left={showX} top={showY}>
                    <TooltipArrow left={(contentRect?.width ?? 0) / 2 - 7} />
                    <TooltipContent role="tooltip" aria-hidden="false" ref={setTooltipRef} padding={padding}>
                        {title !== '' && <TooltipTitle color={titleTextColor}>{title}</TooltipTitle>}
                        <TooltipText fontSize={fontSize}>{children}</TooltipText>
                    </TooltipContent>
                </TooltipContainer>
            ),
            container
        );
    }
);

export default Tooltip;
