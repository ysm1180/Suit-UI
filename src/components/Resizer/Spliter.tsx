import styled from '@emotion/styled';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { borderColor, BorderColorProps, borderWidth, BorderWidthProps } from '../../common';
import PageSplitContext from './context';

interface ResizeElementStyleProps {
    fixed: boolean;
}

const ResizeElementBox = styled.div<ResizeElementStyleProps & BorderColorProps & BorderWidthProps>`
    display: flex;
    position: ${(props) => (props.fixed ? 'fixed' : 'absolute')};
    width: 5px;
    height: ${(props) => (props.fixed ? '100vh' : '100%')};

    align-items: center;

    cursor: col-resize;

    background-repeat: no-repeat;
    transition: color 0.2s linear 0s, background-position 0.2s linear 0s, background-size 0.2s linear 0s,
        background-color 0.2s linear 0s;
    border-left-style: solid;

    ${borderWidth};

    ${borderColor};
`;

const ResizeGripHandle = styled.div`
    display: inline-block;
    width: 3px;
    height: 13px;
    margin-left: 0.2em;
    border-radius: 1px;
    border-left: 2px solid #c1c7d0;
    border-right: 2px solid #c1c7d0;
`;

interface Props {
    fixed?: boolean;
}

type SpliterProps = Props & BorderColorProps<'color'> & BorderWidthProps<'width'>;

const Spliter: React.FC<SpliterProps> = ({ color, width, fixed = false }) => {
    const context = useContext(PageSplitContext)!;
    const initOffset = context?.initSpliterOffset ?? 200;
    const [spliterOffset, setSpliterOffset] = useState(
        context?.side === 'left' ? initOffset : (context?.container?.clientWidth ?? 0) - initOffset
    );

    const computeOffset = useCallback(
        (target: HTMLElement, mouseClientX: number) => {
            const targetWidth = target.offsetWidth;
            const minWidth = context.minWidth;
            const maxWidth = context.maxWidth;
            const mouseOffset = mouseClientX - target.offsetLeft;
            let appliedOffset = mouseOffset;
            if (context.side === 'left') {
                if (mouseOffset < minWidth) {
                    if (mouseOffset < context.thresholdPosition) {
                        appliedOffset = 0;
                    } else {
                        appliedOffset = minWidth;
                    }
                }
                if (maxWidth !== -1 && mouseOffset > maxWidth) {
                    appliedOffset = maxWidth;
                }
                if (mouseOffset > targetWidth) {
                    appliedOffset = targetWidth;
                }
            } else if (context.side === 'right') {
                if (targetWidth - mouseOffset < minWidth) {
                    if (targetWidth - mouseOffset < context.thresholdPosition) {
                        appliedOffset = targetWidth;
                    } else {
                        appliedOffset = targetWidth - minWidth;
                    }
                }
                if (maxWidth !== -1 && targetWidth - mouseOffset > maxWidth) {
                    appliedOffset = targetWidth - maxWidth;
                }
            }

            return appliedOffset;
        },
        [context]
    );

    useEffect(() => {
        if (context.container) {
            const update = () => {
                if (context.container) {
                    const containerWidth = context.container.clientWidth ?? 0;
                    const appliedOffset = computeOffset(context.container, spliterOffset);
                    setSpliterOffset(appliedOffset);
                    context.onResize(appliedOffset, containerWidth - appliedOffset);
                }
            };

            window.addEventListener('resize', update);

            return () => {
                window.removeEventListener('resize', update);
            };
        }
    }, [context, spliterOffset, computeOffset]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (context?.container && e.button === 0) {
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            const mouseMoveEvent = (e: MouseEvent) => {
                let found = false;
                let target: HTMLElement | null = e.target as HTMLElement;
                while (target !== null) {
                    if (target === context.container) {
                        found = true;
                        break;
                    }

                    target = target.parentElement;
                }

                if (found && target) {
                    const targetWidth = target.offsetWidth;
                    const appliedOffset = computeOffset(target, e.clientX);
                    setSpliterOffset(appliedOffset);
                    context.onResize(appliedOffset, targetWidth - appliedOffset);
                }
            };
            const mouseUpEvent = () => {
                document.body.style.cursor = '';
                document.body.style.pointerEvents = '';
                document.body.style.userSelect = '';

                document.removeEventListener('mousemove', mouseMoveEvent);
                document.removeEventListener('mouseup', mouseUpEvent);
            };

            document.addEventListener('mousemove', mouseMoveEvent);
            document.addEventListener('mouseup', mouseUpEvent);
        }
    };

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[Spliter]', 'Rendered');
        console.log({
            color,
            width,
            fixed,
        });
        console.groupEnd();
    }

    return (
        <ResizeElementBox
            fixed={fixed}
            borderColor={color}
            borderWidth={width}
            onMouseDown={onMouseDown}
            style={{ transform: `translate(${spliterOffset}px, 0px)` }}
        >
            <ResizeGripHandle>&nbsp;</ResizeGripHandle>
        </ResizeElementBox>
    );
};

export default Spliter;
