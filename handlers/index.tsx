import React from 'react';
import { Link } from '../src/components/Link';

const Index = ({ title }: any) => {
    return (
        <div id={'home'}>
            <h1>{title}</h1>
            <Link href="/test">Test</Link>
        </div>
    );
};

export const Component = Index;

export const getServerSideProps = () => ({ title: 'Home' });
