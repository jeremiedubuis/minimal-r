import React from 'react';
import ReactDOM from 'react-dom';
import { config, global, Content } from '../_minimal-r/config.client';
import { Router } from './components/Router';
import { RouterClass } from './components/RouterClass';
import type { LazyComponent } from './declarations/declaration';

(() => {
    const router = new RouterClass(
        config.routes,
        window.location.href.replace(window.location.origin, '')
    );

    const hydrate = () =>
        ReactDOM.hydrate(
            <Router
                Content={Content}
                global={global}
                initialProps={JSON.parse(document.getElementById('initialProps').innerHTML)}
                router={router}
            />,
            document.getElementById('minimal-r')
        );

    const init = async () => {
        if (router.match) {
            await (router.match.route.Component as LazyComponent).preload();
        }

        if (document.readyState === 'complete') hydrate();
        else window.addEventListener('load', hydrate);
    };

    init();
})();
