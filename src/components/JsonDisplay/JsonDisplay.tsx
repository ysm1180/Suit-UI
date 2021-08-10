/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { memo } from 'react';
import JsonText from './JsonText';

const JsonDisplayContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export interface JsonDisplayProps {
    title?: string;
    value?: string;
    borderColor?: string;
    indent?: number;
    showArrayKey?: boolean;
}

const JsonDisplay: React.FC<JsonDisplayProps> = memo(
    ({ title = '', value = '', borderColor = 'black', indent = 15, showArrayKey = false }) => {
        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[JsonDisplay]', 'Rendered');
            console.log({ title, value, borderColor, indent, showArrayKey });
            console.groupEnd();
        }

        return (
            <JsonDisplayContainer>
                <div
                    css={css`
                        font-size: 12px;
                        font-weight: bold;
                    `}
                >
                    {title}
                </div>
                <div
                    css={css`
                        padding: 8px;
                        margin-top: 8px;
                        border: 1px solid ${borderColor};
                    `}
                >
                    <JsonText value={value} depth={1} indent={indent} showArrayKey={showArrayKey} />
                </div>
            </JsonDisplayContainer>
        );
    }
);

export default JsonDisplay;
