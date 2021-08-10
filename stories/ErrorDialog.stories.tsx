import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { Button, ErrorDialog, ErrorDialogProps, Icon, icons } from '../src';

export default {
    title: 'suit-ui/ErrorDialog',
    component: ErrorDialog,
    args: {
        titleFontSize: '20px',
        bodyFontSize: '18px',
        title: 'ERROR',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '50vh' }}>
                <Story />
            </div>
        ),
    ],
} as Meta;

const Template: Story<ErrorDialogProps> = (args) => <ErrorDialog {...args} />;

export const Visible = Template.bind({});
Visible.args = {
    body: 'BODY',
    show: true,
};

export const ShowErrorDialog = ({ show, onClose, ...props }) => {
    const [error, setError] = useState(false);

    return (
        <>
            <Button onClick={() => setError(true)}>Throw Error!!!</Button>
            <ErrorDialog
                onClose={() => {
                    action('onClose')();
                    setError(false);
                }}
                show={error}
                {...props}
            />
        </>
    );
};
ShowErrorDialog.args = {
    body: 'BODY',
};
ShowErrorDialog.argTypes = {
    show: { table: { disable: true } },
};

export const CustomErrorWithRefresh = Template.bind({});
CustomErrorWithRefresh.args = {
    title: 'CRITICAL ERROR',
    titleFontSize: 30,
    body: (
        <div>
            It occurs to unknwon errors. Please press button to report error. &nbsp;
            <Button size="small" backgroundColor="black">
                REPORT?
            </Button>
        </div>
    ),
    bodyFontSize: 25,
    show: true,
    refresh: true,
};
