import React from 'react';
import { render } from '@testing-library/react';

// eslint-disable-next-line jest/no-export
export default function mountTest(component: React.ReactElement) {
    describe(`mount and unmount`, () => {
        it(`component unmounted without errors`, () => {
            const { unmount } = render(component);
            expect(() => {
                unmount();
            }).not.toThrow();
        });
    });
}
