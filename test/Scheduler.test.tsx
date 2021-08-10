import React from 'react';
import { Scheduler } from '../src';
import mountTest from '../tests/mountTest';

describe('Scheduler', () => {
    mountTest(<Scheduler />);
});
