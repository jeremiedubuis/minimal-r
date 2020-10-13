import { ComponentType, LazyExoticComponent } from 'react';

export type LazyComponent = LazyExoticComponent<any> & {
    preload: () => Promise<any>;
    preloaded?: boolean;
    preloadedResult?: ComponentType;
};

export type BaseRoute = {
    path: string;
    type?: 'react' | 'node';
};

export type ClientRoute = BaseRoute & {
    Component: LazyComponent;
    useServerSideProps?: boolean;
};

export type ServerReactRoute = BaseRoute & {
    Component: ComponentType;
    getServerSideProps?: Function;
};
export type ServerHandlerRoute = BaseRoute & {
    handler: { get?: Function; post?: Function; put?: Function; delete?: Function };
};

export type ServerRoute = ServerReactRoute | ServerHandlerRoute;

export type Route = ClientRoute | ServerRoute;

export type Params = {
    [key: string]: string;
};

export type PathMatch = {
    route: ClientRoute | ServerReactRoute;
    params: Params;
};

export type RouteMatch = {
    url: string;
    currentPath: string;
    route: ClientRoute | ServerReactRoute;
    params: Params;
    queryParams: object;
};
