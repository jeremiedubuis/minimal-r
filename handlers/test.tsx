import React from 'react';
import { Link } from '../src/components/Link';

const Test = (p: any) => {
    return (
        <div id={'test'}>
            Test
            <Link href="/">Home</Link>
        </div>
    );
};

export const Component = Test;
