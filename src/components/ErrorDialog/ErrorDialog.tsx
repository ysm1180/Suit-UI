/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { memo, ReactNode } from 'react';
import { cssLength, Length } from '../../common';
import { Flex } from '../../base';
import { useUniqueId } from '../../utilities/useUniqueId';
import Button from '../Button/Button';

interface DialogContainerStyleProps {
    show: boolean;
}

const DialogContainer = styled.div<DialogContainerStyleProps>`
    display: ${(props) => (props.show ? 'flex' : 'none')};
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;

    background-color: rgba(0, 0, 0, 0.25);

    z-index: 9999;

    align-items: center;
    justify-content: center;
`;

const DialogBox = styled.div`
    display: flex;
    flex-direction: column;

    min-width: 300px;
    max-width: 80%;
    padding: 10px;
    background-color: white;
`;

export interface ErrorDialogProps {
    show?: boolean;
    title?: string;
    titleFontSize?: Length;
    body?: ReactNode;
    bodyFontSize?: Length;
    onClose?: () => void;
    refresh?: boolean;
}

const ErrorDialog: React.FC<ErrorDialogProps> = memo(
    ({ show = false, title = 'ERROR', titleFontSize = '20px', body, bodyFontSize = '18px', onClose, refresh }) => {
        const titleId = useUniqueId('error-toast-title:');
        const descriptionId = useUniqueId('error-toast-description:');

        const onContainerClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            onClose?.();
        };

        const onBoxClick = (e: React.MouseEvent) => {
            e.stopPropagation();
        };

        const onRefresh = () => {
            window.location.reload();
        };

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[ErrorDialog]', 'Rendered');
            console.log({
                show,
                title,
                titleFontSize,
                body,
                bodyFontSize,
                onClose,
                refresh,
            });
            console.groupEnd();
        }

        return (
            <DialogContainer
                show={show}
                onClick={onContainerClick}
                role="alertdialog"
                aria-modal="true"
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
            >
                <DialogBox onClick={onBoxClick}>
                    <div
                        css={css`
                            font-weight: bold;
                            color: red;
                            font-size: ${cssLength(titleFontSize)};
                        `}
                        id={titleId}
                    >
                        {title}
                    </div>
                    <div
                        css={css`
                            font-size: ${cssLength(bodyFontSize)};
                        `}
                        id={descriptionId}
                    >
                        {body}
                    </div>
                    <br />
                    <Flex flexDirection="row-reverse" justifyContent="space-between">
                        <Button size="large" textColor="white" backgroundColor="#cf1322" onClick={() => onClose?.()}>
                            확인
                        </Button>
                        {refresh && (
                            <Button textColor="white" backgroundColor="#333" onClick={onRefresh}>
                                새로고침
                            </Button>
                        )}
                    </Flex>
                </DialogBox>
            </DialogContainer>
        );
    }
);

export default ErrorDialog;
