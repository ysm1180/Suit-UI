import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Checkbox } from '../src';
import mountTest from '../tests/mountTest';

describe('Checkbox', () => {
    mountTest(<Checkbox />);
    mountTest(<Checkbox label="checkbox" />);

    it('can trigger a function by being clicked', () => {
        const onChange = jest.fn();
        const { getByRole } = render(<Checkbox onChange={onChange} />);
        fireEvent.click(getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
