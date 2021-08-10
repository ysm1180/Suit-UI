import { render } from '@testing-library/react';
import React from 'react';
import { Dropdown } from '../src';
import mountTest from '../tests/mountTest';

describe('Dropdown', () => {
    mountTest(<Dropdown />);
    mountTest(<Dropdown label="dropdown" />);

    it('display initial value correctly', () => {
        const { getByText } = render(<Dropdown items={['item', 'item2', 'item3']} value="item2" />);
        expect(getByText('item2')).toBeInTheDocument();
    });
});
