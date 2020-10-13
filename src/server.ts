import polka from 'polka';
import { createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerResponse } from 'http';
import sirv from 'sirv';
import path from 'path';
import type { ServerHandlerRoute, ServerReactRoute, ServerRoute } from './declarations/declaration';
import { config } from '../_minimal-r/server/config';
import { HTML } from './components/HTML';
import { Router } from './components/Router';
import { RouterClass } from './components/RouterClass';

const handleReact = async (app: any, route: ServerReactRoute) => {
    app.get(route.path, async (req: any, res: ServerResponse) => {
        let initialProps;
        if (typeof route.getServerSideProps === 'function')
            initialProps = await route.getServerSideProps(req, res);
        const el = createElement(
            HTML,
            { req, res, initialProps },
            createElement(Router, {
                initialProps,
                global: {},
                router: new RouterClass(
                    (config.routes as ServerRoute[]).filter(
                        ({ type }) => type === 'react'
                    ) as ServerReactRoute[],
                    req.url
                )
            })
        );
        ReactDOMServer.renderToNodeStream(el).pipe(res);
    });

    if (route.getServerSideProps) {
        app.get(`/api${route.path}`, async (req: any, res: ServerResponse) => {
            req.url = req.url.replace('/api', '');
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(await route.getServerSideProps(req, res)));
        });
    }
};

const handleHandler = async (app: any, route: ServerHandlerRoute) => {
    const r = route.handler;
    console.log(route.path, r);
    if (r.get) app.get(route.path, r.get);
    if (r.post) app.post(route.path, r.post);
    if (r.put) app.put(route.path, r.put);
    if (r.delete) app.delete(route.path, r.delete);
};

const app = polka();

app.use(sirv(path.join(process.cwd(), '_minimal-r/client')));

for (const route of config.routes as ServerRoute[]) {
    if (route.type === 'react') {
        handleReact(app, route as ServerReactRoute);
    } else {
        handleHandler(app, route as ServerHandlerRoute);
    }
}

app.listen(3000, (err: Error) => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
});
