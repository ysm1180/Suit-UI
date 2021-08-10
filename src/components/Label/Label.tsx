/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import clipboardCopy from 'clipboard-copy';
import React, { forwardRef, memo, useCallback } from 'react';
import {
    fontSize,
    FontSizeProps,
    MarginProps,
    MinWidthProps,
    PaddingProps,
    StyleProps,
    textColor,
    TextColorProps,
} from '../../common';
import { Flex } from '../../base';
import { useUniqueId } from '../../utilities/useUniqueId';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';

const LabelTitle = styled.div<TextColorProps & FontSizeProps>`
    font-weight: bold;

    ${textColor}

    ${fontSize}
`;

const LabelBody = styled.div<TextColorProps & MinWidthProps & FontSizeProps>`
    margin: 0;

    ${textColor};

    ${fontSize}
`;

export interface LabelInnerProps {
    title?: string;
    line?: boolean;
    copy?: boolean;
    copyTooltip?: string;
}

export type LabelProps = React.PropsWithChildren<LabelInnerProps> &
    MarginProps &
    PaddingProps &
    FontSizeProps<'titleFontSize'> &
    FontSizeProps &
    StyleProps &
    TextColorProps &
    TextColorProps<'titleColor'>;

const Label = forwardRef<HTMLDivElement, LabelProps>(
    (
        {
            children,
            title,
            line = false,
            textColor = 'black',
            titleColor = 'black',
            titleFontSize = 15,
            fontSize = 13,
            copy,
            copyTooltip = 'Copy',
            ...props
        },
        ref
    ) => {
        const bodyId = useUniqueId('label-body:');

        const onCopy = useCallback(async () => {
            await clipboardCopy(document.getElementById(bodyId)?.textContent ?? '');
        }, [bodyId]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Label]', 'Rendered', bodyId);
            console.log({
                children,
                title,
                line,
                textColor,
                titleColor,
                titleFontSize,
                fontSize,
                copyOnHover: copy,
                copyTooltip,
                ...props,
            });
            console.groupEnd();
        }

        return (
            <Flex
                ref={ref}
                inline
                flexDirection={line ? 'row' : 'column'}
                alignItems={line ? 'center' : undefined}
                tabIndex={-1}
                aria-describedby={bodyId}
                {...props}
            >
                {title && (
                    <LabelTitle
                        css={css`
                            margin-bottom: ${!line ? '6px' : 0};
                            margin-right: ${line ? '6px' : 0};
                        `}
                        textColor={titleColor}
                        fontSize={titleFontSize}
                    >
                        {title}
                    </LabelTitle>
                )}
                <LabelBody textColor={textColor} id={bodyId} fontSize={fontSize}>
                    {children}
                    {copy && (
                        <Button
                            backgroundColor="transparent"
                            textColor={textColor}
                            size="xs"
                            onClick={onCopy}
                            title={copyTooltip}
                        >
                            <Icon icon={icons.regular.copy} />
                        </Button>
                    )}
                </LabelBody>
            </Flex>
        );
    }
);

export default memo(Label);
