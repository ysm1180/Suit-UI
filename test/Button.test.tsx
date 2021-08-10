import { fireEvent, render, screen } from '@testing-library/react';
import React, { Component } from 'react';
import { Button } from '../src';
import mountTest from '../tests/mountTest';

describe('Button', () => {
    mountTest(<Button />);
    mountTest(<Button size="xs" />);
    mountTest(<Button size="small" />);
    mountTest(<Button size="medium" />);
    mountTest(<Button size="large" />);
    mountTest(<Button size="xl" />);

    it('can trigger a function by being clicked', () => {
        const onClick = jest.fn();
        const { getByRole } = render(<Button onClick={onClick}>This is a button</Button>);
        fireEvent.click(getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger a function by being clicked when button is disabled', () => {
        const onClick = jest.fn();
        const { getByRole } = render(
            <Button disabled onClick={onClick}>
                This is a button
            </Button>
        );
        fireEvent.click(getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('display the title tooltip by hovering over it when button`s title is not empty', async () => {
        const tooltipContainer = document.createElement('div');
        document.body.appendChild(tooltipContainer);

        const { getByRole } = render(
            <Button title="it is title" tooltipContainer={tooltipContainer}>
                This is a button
            </Button>
        );
        const button = getByRole('button');
        fireEvent.mouseOver(button);
        expect(await screen.findByText('it is title')).toBeInTheDocument();

        document.body.removeChild(tooltipContainer);
    });

    it('should change loading state by clicking', () => {
        class DefaultButton extends Component {
            state = {
                loading: false,
            };

            enterLoading = () => {
                this.setState({ loading: true });
            };

            render() {
                const { loading } = this.state;
                return (
                    <Button loading={loading} onClick={this.enterLoading}>
                        Button
                    </Button>
                );
            }
        }

        const { getByRole, queryByText } = render(<DefaultButton />);
        fireEvent.click(getByRole('button'));
        expect(queryByText('Button')).toBeNull();
    });
});
