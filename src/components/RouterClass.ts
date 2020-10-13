import { urlToQueryParams } from '../helpers/urlToQueryParams';
import type {
    RouteMatch,
    Route,
    PathMatch,
    Params,
    ClientRoute,
    ServerReactRoute
} from '../declarations/declaration';

export enum RouterEvent {
    Update = 'update'
}

export class RouterClass {
    routes: (ClientRoute | ServerReactRoute)[];
    match: RouteMatch;
    onUpdateListeners: Function[];

    constructor(routes: (ClientRoute | ServerReactRoute)[], path: string) {
        this.routes = routes;
        this.match = this.parseUrl(path);
        this.onUpdateListeners = [];
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', this.onPopState);
        }
    }

    removeDomainFromUrl(url: string): string {
        if (typeof window !== 'undefined') return url.replace(window.location.origin, '');
        return url;
    }

    parseUrl(url: string = '/'): RouteMatch {
        const queryParams = urlToQueryParams(url);
        let path = this.removeDomainFromUrl(
            url
                .split('?')
                .shift()
                .replace(/^https?:\/\//, '')
        );
        const { route, params } = this.parsePath(path);
        return {
            url,
            currentPath: path,
            route,
            params,
            queryParams
        };
    }

    parsePath(path: string): PathMatch {
        const pathParts = path.split('/');
        for (let route of this.routes) {
            const routeParts = route.path.split('/');
            let params: Params = {};
            let matches = true;

            for (let i = 0, iLength = pathParts.length; i < iLength; i++) {
                if (pathParts[i] === routeParts[i]) continue;

                // if mandatory parameter
                if (/^:/.test(routeParts[i])) {
                    if (!pathParts[i]) {
                        matches = false;
                        break;
                    } else {
                        params[routeParts[i].replace(':', '')] = pathParts[i];
                    }
                } else if (/^\?/.test(routeParts[i])) {
                    if (pathParts[i]) params[routeParts[i].replace('?', '')] = pathParts[i];
                    else {
                        matches = false;
                        break;
                    }
                } else {
                    matches = false;
                    break;
                }
            }

            if (!matches) {
                params = {};
                continue;
            }

            return {
                route,
                params
            };
        }

        return null;
    }

    onUpdate = () => {
        this.onUpdateListeners.forEach((cb) => cb(this.match));
    };

    addListener = (event: string, cb: Function) => {
        if (event === 'update') this.onUpdateListeners.push(cb);
    };

    removeListener = (event: string, cb: Function) => {
        if (event === 'update')
            this.onUpdateListeners.splice(this.onUpdateListeners.indexOf(cb), 1);
    };

    goto = (url: string, silent: boolean, replace: boolean) => {
        const match = this.parseUrl(url);
        if (JSON.stringify(match) !== JSON.stringify(this.match)) {
            this.match = match;
            history[replace ? 'replaceState' : 'pushState'](null, null, url);
            if (!silent) this.onUpdate();
        }
    };

    onPopState = () => {
        this.match = this.parseUrl(this.removeDomainFromUrl(window.location.href));
        this.onUpdate();
    };
}
