import React from 'react';
import { ErrorToast } from '../src';
import mountTest from '../tests/mountTest';

describe('ErrorToast', () => {
    mountTest(<ErrorToast />);
});
