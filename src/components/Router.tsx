import React, { Suspense, ComponentType } from 'react';
import { Error404 } from './Error404';
import { RouterClass, RouterEvent } from './RouterClass';
import type { RouteMatch, LazyComponent, ClientRoute } from '../declarations/declaration';

type RouterProps = {
    initialProps: object;
    router: RouterClass;
    global: { firstRender?: boolean };
};

type RouterState = {
    match: RouteMatch;
    data: any;
};

let router: RouterClass;

export class Router extends React.Component<RouterProps, RouterState> {
    constructor(props: RouterProps) {
        super(props);
        router = this.props.router;
        this.state = {
            match: this.props.router.match,
            data: props.initialProps
        };
    }

    componentDidMount() {
        this.props.global.firstRender = false;
        router.addListener(RouterEvent.Update, this.onUpdate);
    }

    componentWillUnmount() {
        router.removeListener(RouterEvent.Update, this.onUpdate);
    }

    render() {
        if (!this.state.match) return <Error404 />;
        const {
            route: { Component }
        } = this.state.match;

        const props = this.state.data || {};

        if (typeof window !== 'undefined')
            return this.renderLazy(Component as LazyComponent, props);
        const Comp = Component as ComponentType;
        return <Comp {...props} />;
    }

    renderLazy(Component: LazyComponent, props: object) {
        if (Component.preloaded) {
            const Comp = Component.preloadedResult;
            return <Comp {...props} />;
        }
        return (
            <Suspense fallback={<>Loading</>}>
                <Component {...props} />
            </Suspense>
        );
    }

    static goto(url: string, silent: boolean = false, replace: boolean = false) {
        router.goto(url, silent, replace);
    }

    static getMatch() {
        return router.match;
    }

    onUpdate = async (match: RouteMatch) => {
        const data = (match.route as ClientRoute).useServerSideProps
            ? await fetch(`/api${match.route.path}`).then((r) => r.json())
            : {};
        this.setState({ match, data });
    };
}
