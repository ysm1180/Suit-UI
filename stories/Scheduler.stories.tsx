import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Scheduler, Label, SchedulerProps } from '../src';

export default {
    title: 'suit-ui/Scheduler',
    component: Scheduler,
} as Meta;

const DefaultTemplate: Story<SchedulerProps> = ({ ...props }) => <Scheduler {...props} />;

export const Default = DefaultTemplate.bind({});
Default.args = {};

const now = new Date(Date.now());
const nextMonth = new Date(Date.now());
nextMonth.setMonth(nextMonth.getMonth() + 1);

const timelineData = [];
for (let i = 1; i <= 100; i++) {
    timelineData.push({ key: `${i}`, start: now, end: nextMonth, category: 'Category1', text: 'Test', visible: true });
}
export const Timelines = DefaultTemplate.bind({});
Timelines.args = {
    timelines: timelineData,
};

export const LimitHeight = DefaultTemplate.bind({});
LimitHeight.args = {
    ...Timelines.args,
    height: 300,
};

export const CategoryColor = DefaultTemplate.bind({});
CategoryColor.args = {
    ...Timelines.args,
    timelineColorFilter: (category: string) => {
        if (category === 'Category1') {
            return 'black';
        } else if (category === 'Category2') {
            return 'white';
        } else if (category === 'Category3') {
            return 'yellow';
        }

        return null;
    },
};
