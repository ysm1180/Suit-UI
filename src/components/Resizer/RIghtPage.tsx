import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { cssLength } from '../../common';
import PageSplitContext, { InnerPageProps } from './context';

interface PageElementStyleProps {
    flex: boolean;
}
const PageElement = styled.div<PageElementStyleProps>`
    display: ${(props) => (props.flex ? 'flex' : undefined)};
    min-width: 0;
    margin-left: 20px;
    box-sizing: border-box;
    overflow: hidden;
`;

const RightPage: React.FC<InnerPageProps> = ({ flex = false, children }) => {
    const context = useContext(PageSplitContext);
    const adjustWidth = context?.rightWidth;

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[RightPage]', 'Rendered');
        console.log({
            flex,
            children,
        });
        console.groupEnd();
    }

    return (
        <PageElement
            flex={flex}
            style={{
                display: adjustWidth === 0 ? 'none' : undefined,
                width: cssLength(adjustWidth),
            }}
        >
            {children}
        </PageElement>
    );
};

export default RightPage;
