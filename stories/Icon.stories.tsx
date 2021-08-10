import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Icon, IconProps, icons } from '../src';

export default {
    title: 'suit-ui/Icon',
    component: Icon,
    argTypes: {
        color: { control: 'color' },
    },
} as Meta;

const Template: Story<IconProps> = ({ ...props }) => <Icon {...props} />;

export const Circle = Template.bind({});
Circle.args = {
    icon: icons.regular.circle,
    size: '3x',
};

export const Plus = Template.bind({});
Plus.args = {
    icon: icons.regular.plus,
    size: '3x',
};

export const Check = Template.bind({});
Check.args = {
    icon: icons.regular.check,
    size: '3x',
};

export const QuestionCircle = Template.bind({});
QuestionCircle.args = {
    icon: icons.regular.questionCircle,
    size: '3x',
};

export const Question = Template.bind({});
Question.args = {
    icon: icons.regular.question,
    size: '3x',
};

export const CaretUp = Template.bind({});
CaretUp.args = {
    icon: icons.regular.caretUp,
    size: '3x',
};

export const CaretDown = Template.bind({});
CaretDown.args = {
    icon: icons.regular.caretDown,
    size: '3x',
};

export const CaretLeft = Template.bind({});
CaretLeft.args = {
    icon: icons.regular.caretLeft,
    size: '3x',
};

export const CaretRight = Template.bind({});
CaretRight.args = {
    icon: icons.regular.caretRight,
    size: '3x',
};

export const ChevronUp = Template.bind({});
ChevronUp.args = {
    icon: icons.regular.chevronUp,
    size: '3x',
};

export const ChevronDown = Template.bind({});
ChevronDown.args = {
    icon: icons.regular.chevronDown,
    size: '3x',
};

export const ChevronLeft = Template.bind({});
ChevronLeft.args = {
    icon: icons.regular.chevronLeft,
    size: '3x',
};

export const ChevronRight = Template.bind({});
ChevronRight.args = {
    icon: icons.regular.chevronRight,
    size: '3x',
};

export const ArrowUp = Template.bind({});
ArrowUp.args = {
    icon: icons.regular.arrowUp,
    size: '3x',
};

export const ArrowDown = Template.bind({});
ArrowDown.args = {
    icon: icons.regular.arrowDown,
    size: '3x',
};

export const ArrowLeft = Template.bind({});
ArrowLeft.args = {
    icon: icons.regular.arrowLeft,
    size: '3x',
};

export const ArrowRight = Template.bind({});
ArrowRight.args = {
    icon: icons.regular.arrowRight,
    size: '3x',
};

export const Copy = Template.bind({});
Copy.args = {
    icon: icons.regular.copy,
    size: '3x',
};

export const Close = Template.bind({});
Close.args = {
    icon: icons.regular.close,
    size: '3x',
};

export const Filter = Template.bind({});
Filter.args = {
    icon: icons.regular.filter,
    size: '3x',
};

export const Spinner = Template.bind({});
Spinner.args = {
    icon: icons.regular.spinner,
    size: '3x',
    spin: true,
};

export const AnimationCircles = Template.bind({});
AnimationCircles.args = {
    icon: icons.animation.circles,
    size: '3x',
};

export const AnimationBars = Template.bind({});
AnimationBars.args = {
    icon: icons.animation.bars,
    size: '3x',
};

export const AnimationTails = Template.bind({});
AnimationTails.args = {
    icon: icons.animation.tails,
    size: '3x',
};

export const AnimationThreeDots = Template.bind({});
AnimationThreeDots.args = {
    icon: icons.animation.threeDots,
    size: '3x',
};
