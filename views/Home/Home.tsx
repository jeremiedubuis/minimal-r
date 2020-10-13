import './Home.scss';
import React from 'react';
import { Link } from '../../src/components/Link';
import { updateHead } from '../../src/hooks/updateHead';

export const Home = ({ title }: any) => {
    updateHead({ title: 'Home' });

    return (
        <div id={'home'}>
            <h1>{title}</h1>
            <Link href="/test">Test</Link>
        </div>
    );
};
