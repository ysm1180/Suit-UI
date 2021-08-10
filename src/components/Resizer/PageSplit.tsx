/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { PageSplitContextProvider } from './context';
import LeftPage from './LeftPage';
import RightPage from './RIghtPage';
import Spliter from './Spliter';

const PageSplitContainer = styled.div`
    display: flex;
    position: relative;
    width: 100%;
`;

interface Props {
    initOffset?: number;
    sidebarPosition?: 'left' | 'right';
    minSidebarWidth?: number;
    maxSidebarWidth?: number;
    thresholdWidth?: number;
    onAfterResize?: (left: number, right: number) => void;
    children?: React.ReactElement<typeof LeftPage | typeof RightPage>[];
}

export type PageSplitProps = Props;

export type PageSplitType = React.FC<PageSplitProps> & {
    Left: typeof LeftPage;
    Right: typeof RightPage;
    Spliter: typeof Spliter;
};

const PageSplit: PageSplitType = ({
    initOffset = 200,
    sidebarPosition = 'left',
    minSidebarWidth = 0,
    maxSidebarWidth = -1,
    thresholdWidth = 0,
    onAfterResize,
    children,
}) => {
    const [leftPageWidth, setLeftPageWidth] = useState<number | undefined>(undefined);
    const [rightPageWidth, setRightPageWidth] = useState<number | undefined>(undefined);
    const [node, setNode] = useState<HTMLDivElement | null>(null);

    const onResize = useCallback(
        (left: number, right: number) => {
            setLeftPageWidth(left);
            setRightPageWidth(right);

            onAfterResize?.(left, right);
        },
        [onAfterResize]
    );

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[PageSplit]', 'Rendered');
        console.log({
            initOffset,
            sidebarPosition,
            minSidebarWidth,
            maxSidebarWidth,
            thresholdWidth,
            onAfterResize,
            children,
        });
        console.groupEnd();
    }

    return (
        <PageSplitContainer ref={setNode}>
            <PageSplitContextProvider
                value={{
                    initSpliterOffset: initOffset,
                    container: node,
                    onResize,
                    side: sidebarPosition,
                    minWidth: minSidebarWidth,
                    maxWidth: maxSidebarWidth,
                    thresholdPosition: thresholdWidth,
                    leftWidth:
                        leftPageWidth ??
                        (sidebarPosition === 'left' ? initOffset : (node?.clientWidth ?? 0) - initOffset),
                    rightWidth:
                        rightPageWidth ??
                        (sidebarPosition === 'right' ? initOffset : (node?.clientWidth ?? 0) - initOffset),
                }}
            >
                {node !== null && children}
            </PageSplitContextProvider>
        </PageSplitContainer>
    );
};

PageSplit.Left = LeftPage;
PageSplit.Right = RightPage;
PageSplit.Spliter = Spliter;

export default PageSplit;
