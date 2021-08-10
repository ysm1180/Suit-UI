/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { backgroundColor, BackgroundColorProps, borderColor, BorderColorProps, width, WidthProps } from '../../common';
import { Flex } from '../../base';
import { TabChangeEvent, TabClickEvent, TabIdentity } from '../../types/tab';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import icons from '../Icon/icons';
import { TabContextProvider } from './context';
import TabLabel, { TabLabelProps } from './TabLabel';
import TabPanel, { TabPanelProps } from './TabPanel';

export interface TabsHandle {
    selectIndex(index: number): void;
    select(id: TabIdentity): void;
    getSelectedId(): TabIdentity | null | undefined;
    getSelectedIndex(): number;
    getIndex(id: TabIdentity): number;
}

interface TabLabelStyleProps {
    selected: boolean;
    selectedColor: string;
    hoverColor: string;
    disable: boolean;
    block: boolean;
}

const Tab = styled.button<TabLabelStyleProps & WidthProps & BackgroundColorProps & BorderColorProps>`
    display: inline-flex;
    font-size: 14px;
    padding: 10px;
    text-align: center;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: 400;
    border: 0;
    border-bottom: 2px solid;
    user-select: none;
    text-decoration: none;

    ${width}

    ${backgroundColor}

    ${borderColor}

    &:hover, &:focus {
        outline: 0;
        color: ${(props) => props.hoverColor};
        border-color: ${(props) => props.hoverColor};
    }

    ${(props) =>
        props.selected &&
        css`
            font-weight: 600;
            color: ${props.selectedColor};
            border-color: ${props.selectedColor};
        `}
    ${(props) =>
        props.disable &&
        css`
            cursor: not-allowed;
            color: #666666;
        `}

    ${(props) =>
        props.block &&
        css`
            flex: 1;
        `}
`;

export interface TabOptions {
    id: TabIdentity;
    label: string;
    disable: boolean;
    visible: boolean;
}

export interface TabsInnerProps {
    hoverColor?: string;
    defaultSelectedId?: TabIdentity;
    onSelectedIndexChange?: (e: TabChangeEvent) => void;
    selectedColor?: string;
    children?: React.ReactElement<TabPanelProps | TabLabelProps> | React.ReactElement<TabPanelProps | TabLabelProps>[];
    tabs?: React.ReactElement<TabPanelProps | TabLabelProps>[];
    block?: boolean;
    onTabClick?: (e: TabClickEvent) => void;
    onTabClose?: (e: TabChangeEvent) => boolean;
    onTabClosed?: (e: TabChangeEvent) => void;
}

export type TabsProps = TabsInnerProps & BackgroundColorProps & BorderColorProps;

const Tabs = forwardRef<TabsHandle, TabsProps>(
    (
        {
            hoverColor = '#1890FF',
            defaultSelectedId,
            onSelectedIndexChange,
            selectedColor = '#333',
            borderColor = '#CCC',
            backgroundColor = 'transparent',
            children,
            tabs = [],
            block = false,
            onTabClick,
            onTabClose,
            onTabClosed,
        },
        ref
    ) => {
        const [selectedId, setSelectedId] = useState<TabIdentity | null | undefined>(defaultSelectedId);
        const [contextValue, setContextValue] = useState({
            selectedId,
        });
        const [closeIds, setCloseIds] = useState<TabIdentity[]>([]);

        const resolvedTabs: React.ReactElement<TabPanelProps | TabLabelProps>[] = useMemo(
            () =>
                children
                    ? Array.isArray(children)
                        ? tabs.concat(children)
                        : ([...tabs, children] as React.ReactElement<TabPanelProps | TabLabelProps>[])
                    : tabs,
            [tabs, children]
        );

        useImperativeHandle(ref, () => ({
            selectIndex: (index: number) => {
                const foundTab = resolvedTabs.filter(
                    (tab) => !closeIds.includes(tab.props.id) && (tab.props.visible ?? true)
                )[index];
                setSelectedId(foundTab?.props.id);
            },
            select: (id: TabIdentity) => {
                setSelectedId(id);
            },
            getSelectedId: () => {
                return selectedId;
            },
            getSelectedIndex: () => {
                return (
                    resolvedTabs
                        .filter((tab) => !closeIds.includes(tab.props.id) && (tab.props.visible ?? true))
                        .map((tab, index) => ({
                            id: tab.props.id,
                            index,
                        }))
                        .find((tab) => tab.id === selectedId)?.index ?? -1
                );
            },
            getIndex: (id: TabIdentity) => {
                return (
                    resolvedTabs
                        .filter((tab) => !closeIds.includes(tab.props.id) && (tab.props.visible ?? true))
                        .map((tab, index) => ({
                            id: tab.props.id,
                            index,
                        }))
                        .find((tab) => tab.id === id)?.index ?? -1
                );
            },
        }));

        const onTabPanelClick = useCallback(
            (e: React.MouseEvent, id: TabIdentity, index: number) => {
                onTabClick?.({ nativeEvent: e.nativeEvent, id, index });
                const foundTab = resolvedTabs.find((tab) => tab.props.id === id);
                if ((foundTab?.props.visible ?? true) && !foundTab?.props.disable && selectedId !== id) {
                    setSelectedId(id);
                    onSelectedIndexChange?.({ id, index });
                }
            },
            [resolvedTabs, onTabClick, onSelectedIndexChange, selectedId]
        );

        useEffect(() => {
            if (defaultSelectedId && selectedId !== defaultSelectedId) {
                const foundIndex = resolvedTabs.findIndex((tab) => tab.props.id === defaultSelectedId);
                onSelectedIndexChange?.({ id: defaultSelectedId, index: foundIndex });
                setSelectedId(defaultSelectedId);
            }
        }, [defaultSelectedId]);

        const onTabCloseClick = useCallback(
            (e: React.MouseEvent, id: TabIdentity, index: number) => {
                e.stopPropagation();
                if (onTabClose?.({ id, index }) ?? true) {
                    setCloseIds((ids) => [...ids, id]);
                    onTabClosed?.({ id, index });
                }
            },
            [onTabClosed, onTabClose]
        );

        useEffect(() => {
            setContextValue((oldContext) => ({ ...oldContext, selectedId }));
        }, [selectedId]);

        if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SUIT) {
            console.group('[Tabs]', 'Rendered');
            console.log({
                hoverColor,
                defaultSelectedId,
                onSelectedIndexChange,
                selectedColor,
                borderColor,
                backgroundColor,
                children,
                tabs,
                block,
                onTabClick,
                onTabClose,
                onTabClosed,
            });
            console.groupEnd();
        }

        return (
            <TabContextProvider value={contextValue}>
                <div
                    css={css`
                        margin-bottom: 8px;
                    `}
                    role="tablist"
                >
                    <Flex overflowX="auto">
                        {resolvedTabs
                            .filter((tab) => !closeIds.includes(tab.props.id) && (tab.props.visible ?? true))
                            .map((tab, index) => {
                                if (tab.type === TabPanel) {
                                    return (
                                        <Tab
                                            role="tab"
                                            tabIndex={0}
                                            onClick={(e) => onTabPanelClick(e, tab.props.id, index)}
                                            key={tab.props.id}
                                            selected={tab.props.id === selectedId}
                                            backgroundColor={backgroundColor}
                                            hoverColor={hoverColor}
                                            borderColor={borderColor}
                                            selectedColor={selectedColor}
                                            disable={tab.props.disable ?? false}
                                            block={!tab.props.fixed && block}
                                        >
                                            {tab.props.tab}
                                            {tab.props.close && (
                                                <Button
                                                    ml=".75em"
                                                    size="xs"
                                                    backgroundColor="transparent"
                                                    textColor="black"
                                                    hoverBackgroundColor="#eee"
                                                    borderRadius="3px"
                                                    onClick={(e) => onTabCloseClick(e, tab.props.id, index)}
                                                >
                                                    <Icon icon={icons.regular.close} />
                                                </Button>
                                            )}
                                        </Tab>
                                    );
                                } else if (tab.type === TabLabel) {
                                    return (
                                        <Tab
                                            role="tab"
                                            tabIndex={0}
                                            onClick={(e) =>
                                                onTabClick?.({ nativeEvent: e.nativeEvent, id: tab.props.id, index })
                                            }
                                            key={tab.props.id}
                                            selected={false}
                                            backgroundColor={backgroundColor}
                                            hoverColor={hoverColor}
                                            borderColor={borderColor}
                                            selectedColor={selectedColor}
                                            disable={tab.props.disable ?? false}
                                            block={!tab.props.fixed && block}
                                        >
                                            {tab.props.tab}
                                            {tab.props.close && (
                                                <Button
                                                    ml=".75em"
                                                    size="xs"
                                                    backgroundColor="transparent"
                                                    textColor="black"
                                                    hoverBackgroundColor="#eee"
                                                    borderRadius="3px"
                                                    onClick={(e) => onTabCloseClick(e, tab.props.id, index)}
                                                >
                                                    <Icon icon={icons.regular.close} />
                                                </Button>
                                            )}
                                        </Tab>
                                    );
                                }

                                return null;
                            })}
                    </Flex>
                </div>

                {resolvedTabs.filter((tab) => !closeIds.includes(tab.props.id))}
            </TabContextProvider>
        );
    }
);

export default Tabs;
