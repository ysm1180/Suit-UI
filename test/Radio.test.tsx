import React from 'react';
import { Radio, RadioGroup } from '../src';
import mountTest from '../tests/mountTest';

describe('Radio', () => {
    mountTest(<Radio />);
    mountTest(<RadioGroup />);
});
