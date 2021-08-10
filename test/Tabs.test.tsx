import { fireEvent, render } from '@testing-library/react';
import React, { useCallback, useState } from 'react';
import { TabChangeEvent, TabClickEvent, TabIdentity, TabLabel, TabPanel, Tabs } from '../src';
import mountTest from '../tests/mountTest';

interface TabWithTwoPanelsProps {
    onClick?: (e: TabClickEvent) => void;
    onChange?: (e: TabChangeEvent) => void;
    defaultSelectedId?: TabIdentity;
}

const TabWithTwoPanels: React.FC<TabWithTwoPanelsProps> = ({ onClick, onChange, defaultSelectedId }) => {
    return (
        <Tabs onTabClick={onClick} onSelectedIndexChange={onChange} defaultSelectedId={defaultSelectedId}>
            <TabPanel id="1" tab="First">
                It is First Content
            </TabPanel>
            <TabPanel id="2" tab="Second">
                It is Second Content
            </TabPanel>
        </Tabs>
    );
};

const TabClickFollowDefaultSelectedId: React.FC<Omit<TabWithTwoPanelsProps, 'defaultSelectedId'>> = ({
    onClick,
    onChange,
}) => {
    const [defaultSelectedId, setDefaultSelectedId] = useState<TabIdentity>();

    const onTabClick = useCallback(
        (e: TabClickEvent) => {
            setDefaultSelectedId(e.id);
            onClick?.(e);
        },
        [onClick]
    );

    return (
        <Tabs onTabClick={onTabClick} onSelectedIndexChange={onChange} defaultSelectedId={defaultSelectedId}>
            <TabPanel id="1" tab="First">
                It is First Content
            </TabPanel>
            <TabPanel id="2" tab="Second">
                It is Second Content
            </TabPanel>
        </Tabs>
    );
};

describe('Tabs', () => {
    mountTest(<Tabs />);
    mountTest(<TabPanel id="tab" />);
    mountTest(<TabLabel id="tab" />);

    it('should render all tab panel contents', () => {
        const { getByText } = render(<TabWithTwoPanels />);

        const first = getByText('It is First Content');
        const second = getByText('It is Second Content');
        expect(first).toBeInTheDocument();
        expect(second).toBeInTheDocument();
    });

    it('should show only the selected tab panel content', () => {
        const { getByText } = render(<TabWithTwoPanels defaultSelectedId="2" />);

        const first = getByText('It is First Content');
        const second = getByText('It is Second Content');
        expect(first).not.toBeVisible();
        expect(second).toBeVisible();
    });

    it('can trigger functions by being clicked', () => {
        const onClick = jest.fn();
        const onChange = jest.fn();

        const { getByText } = render(<TabWithTwoPanels onClick={onClick} onChange={onChange} />);

        fireEvent.click(getByText('Second'));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should not trigger a function by being clicked an id such as the selected id', () => {
        const onChange = jest.fn();

        const { getByText } = render(<TabWithTwoPanels onChange={onChange} defaultSelectedId="1" />);

        fireEvent.click(getByText('First'));
        expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('can trigger a function by changing default id', () => {
        const onChange = jest.fn();

        const { rerender } = render(<TabWithTwoPanels onChange={onChange} defaultSelectedId="1" />);
        rerender(<TabWithTwoPanels onChange={onChange} defaultSelectedId="2" />);

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should trigger a function only once by being clicked', () => {
        const onChange = jest.fn();

        const { getByText } = render(<TabClickFollowDefaultSelectedId onChange={onChange} />);

        fireEvent.click(getByText('First'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
