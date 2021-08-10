import { createContext } from 'react';

interface PageSplitContextProps {
    initSpliterOffset: number;
    minWidth: number;
    maxWidth: number;
    thresholdPosition: number;
    side: 'left' | 'right';
    container: HTMLElement | null;
    leftWidth?: number;
    rightWidth?: number;
    onResize: (left: number, right: number) => void;
}

export interface InnerPageProps {
    flex?: boolean;
}

const PageSplitContext = createContext<PageSplitContextProps | null>(null);

export const PageSplitContextProvider = PageSplitContext.Provider;

export default PageSplitContext;
