import React from 'react';
import { Link } from '../src/components/Link';
import { updateHead } from '../src/hooks/updateHead';

const Test = (p: any) => {
    updateHead({ title: 'Test' });
    return (
        <div id={'test'}>
            Test
            <form>
                <label htmlFor="mon-formulaire-email">E-mail</label>
                <input type="email" id="mon-formulaire-email" name="email" />
            </form>
            <Link href="/">Home</Link>
        </div>
    );
};

export const Component = Test;
