import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React, { useMemo, useRef, useState } from 'react';
import { Button, Icon, icons, TabPanel, Tabs, TabsProps } from '../src';
import { TabLabel, TabPanelProps, TabsHandle } from '../src/components/Tabs';
import { TabClickEvent, TabIdentity } from '../src/types/tab';

export default {
    title: 'suit-ui/Tabs',
    component: Tabs,
    subcomponents: { TabPanel },
} as Meta;

const Template: Story<TabsProps & { close: boolean }> = ({ close, ...args }) => (
    <Tabs {...args}>
        <TabPanel tab="Page 1" id="1" close={close} flexDirection="column">
            <div>Tab Page 1</div>
            <div>Panel is flex, flex direction is column</div>
        </TabPanel>
        <TabPanel tab="Page 2" id="2" close={close}>
            <div>Tab Page 2</div>
            <div>Panel is flex, flex direction is defualt (row)</div>
        </TabPanel>
        <TabPanel tab="Page 3" id="3" close={close} flexDirection="column-reverse">
            <div>Tab Page 3</div>
            <div>Panel is flex, flex direction is column-reverse</div>
        </TabPanel>
    </Tabs>
);

export const Default = Template.bind({});
Default.args = {};

export const CustomColor = Template.bind({});
CustomColor.args = {
    borderColor: 'blue',
    selectedColor: 'red',
};

export const Block = ({ block, ...args }) => (
    <>
        <Tabs block {...args}>
            <TabPanel tab="Page 1" id="1">
                <div>Tab Page 1</div>
            </TabPanel>
            <TabPanel tab="Page 2" id="2">
                <div>Tab Page 2</div>
            </TabPanel>
            <TabPanel tab="Page 3" id="3">
                <div>Tab Page 3</div>
            </TabPanel>
        </Tabs>
        <Tabs block {...args}>
            <TabPanel tab="Very Very Very long text..." id="1"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="2"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="3"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="4"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="5"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="6"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="7"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="8"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="9"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="10"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="11"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="12"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="13"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="14"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="15"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="20"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="21"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="23"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="24"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="25"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="26"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="27"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="28"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="29"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="30"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="31"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="32"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="33"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="34"></TabPanel>
            <TabPanel tab="Very Very Very long text..." id="35"></TabPanel>
        </Tabs>
    </>
);

export const DefaultSelected = Template.bind({});
DefaultSelected.args = {
    defaultSelectedId: '1',
};

export const AddTab = () => {
    const [tabs, setTabs] = useState<TabIdentity[]>([1, 2]);
    const panels: React.ReactElement<TabPanelProps>[] = useMemo(() => {
        return tabs.map((tab) => {
            return (
                <TabPanel tab={`Page ${tab}`} id={tab}>
                    Tab Page {tab}
                </TabPanel>
            );
        });
    }, [tabs]);

    const onTabClick = (e: TabClickEvent) => {
        action('onTabClick')(e);
        e.id === 'add' && setTabs((tabs) => [...tabs, tabs.length + 1]);
    };

    return (
        <Tabs onTabClick={onTabClick} onSelectedIndexChange={action('onSelectedIndexChange')} tabs={panels}>
            <TabLabel id="add" fixed tab={<Icon icon={icons.regular.plus} />} />
        </Tabs>
    );
};

export const CloseTabPanel = Template.bind({});
CloseTabPanel.args = {
    close: true,
};

export const CanNotClosePanel = Template.bind({});
CanNotClosePanel.args = {
    close: true,
    onTabClose: (e) => {
        action('onTabClose return false')(e);
        return false;
    },
};

export const TabRefAction = () => {
    const tabsRef = useRef<TabsHandle>();

    return (
        <div>
            <Button onClick={() => tabsRef.current.selectIndex(0)}>Select Tab 1</Button>
            <Button onClick={() => tabsRef.current.selectIndex(1)}>Select Tab 2</Button>
            <Button onClick={() => tabsRef.current.selectIndex(2)}>Select Tab 3</Button>
            <Tabs ref={tabsRef} onSelectedIndexChange={action('onSelectedIndexChange')}>
                <TabPanel tab="Tab 1" id="1">
                    Tab Page 1
                </TabPanel>
                <TabPanel tab="Tab 2" id="2">
                    Tab Page 2
                </TabPanel>
                <TabPanel tab="Tab 3" id="3">
                    Tab Page 3
                </TabPanel>
            </Tabs>
            <br />
            <Button onClick={() => alert(tabsRef.current.getSelectedId())}>I know selected tab id!!</Button>
        </div>
    );
};
