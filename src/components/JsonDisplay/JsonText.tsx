/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Fragment, memo, useMemo, useState } from 'react';
import { textColor, TextColorProps } from '../../common';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';

const JsonValue = styled.span<TextColorProps>`
    ${textColor}
`;

interface JsonTextProps {
    value: string;
    depth: number;
    indent: number;
    showArrayKey: boolean;
}

const JsonText: React.FC<JsonTextProps> = memo(({ value, depth, indent, showArrayKey }) => {
    const [isOpenValues, setIsOpenValues] = useState<{ [key: string]: boolean }>({});

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
        console.group('[JsonText]', 'Rendered');
        console.log({ value, depth, indent, showArrayKey });
        console.groupEnd();
    }

    const indentLength = useMemo(() => (depth === 1 ? 15 : depth * indent), [depth, indent]);

    const jsonKeyList: string[] = [];
    const jsonValues: Record<string, unknown> = {};
    if (value) {
        try {
            const json = JSON.parse(value) as Record<string, unknown>;
            for (const key in json) {
                jsonKeyList.push(key);
                jsonValues[key] = json[key];
            }
        } catch {
            return (
                <JsonValue
                    css={css`
                        font-size: 13px;
                    `}
                >
                    {value}
                </JsonValue>
            );
        }
    }

    return (
        <div
            css={css`
                margin-left: ${indentLength}px;
                font-size: 13px;
            `}
        >
            {jsonKeyList.map((key, index) => {
                const isLast = jsonKeyList.length - 1 === index;
                const jsonValue = jsonValues[key];

                let buttonElement = null;

                let valueElement = <div />;
                if (typeof jsonValue === 'number') {
                    valueElement = <JsonValue color="darkorange">{jsonValue}</JsonValue>;
                } else if (typeof jsonValue === 'string') {
                    valueElement = <JsonValue color="blue">"{jsonValue}"</JsonValue>;
                } else if (typeof jsonValue === 'object') {
                    if (jsonValue === null) {
                        valueElement = <JsonValue color="magenta">null</JsonValue>;
                    } else {
                        const keys = Object.keys(jsonValue);
                        const onClick = () => {
                            setIsOpenValues((s) => ({ ...s, [key]: !s[key] }));
                        };
                        if (keys.length > 0) {
                            buttonElement = (
                                <Button
                                    backgroundColor="#333"
                                    hoverBackgroundColor="#666"
                                    textColor="white"
                                    size="xs"
                                    onClick={onClick}
                                    style={{
                                        marginLeft: '-17px',
                                        marginRight: '3px',
                                        padding: '2px 1px',
                                    }}
                                >
                                    {isOpenValues[key] ? (
                                        <Icon icon={icons.regular.minus} size={'xs'} />
                                    ) : (
                                        <Icon icon={icons.regular.plus} size={'xs'} />
                                    )}
                                </Button>
                            );
                            valueElement = (
                                <div>
                                    <JsonText
                                        value={JSON.stringify(jsonValue)}
                                        depth={depth + 1}
                                        indent={indent}
                                        showArrayKey={showArrayKey}
                                    />
                                </div>
                            );
                        } else {
                            valueElement = <span />;
                        }
                    }
                } else if (typeof jsonValue === 'boolean') {
                    valueElement = <JsonValue color="red">{jsonValue ? 'true' : 'false'}</JsonValue>;
                }

                return (
                    <div key={key}>
                        {buttonElement}
                        <JsonValue color="#7f0055">
                            {(!Array.isArray(JSON.parse(value)) || showArrayKey) && `"${key}" : `}
                            {typeof jsonValue === 'object' && jsonValue && (Array.isArray(jsonValue) ? '[' : '{')}
                        </JsonValue>
                        {typeof jsonValue === 'object' && jsonValue ? (
                            <Fragment>
                                {isOpenValues[key] ? valueElement : ' ... '}
                                {Array.isArray(jsonValue) ? `]` : '}'}
                            </Fragment>
                        ) : (
                            valueElement
                        )}
                        {!isLast && <span>,</span>}
                    </div>
                );
            })}
        </div>
    );
});

export default JsonText;
