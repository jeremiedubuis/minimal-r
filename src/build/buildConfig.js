const path = require('path');
const { createDir } = require('./helpers/createDir');
const { createFileInDir } = require('./helpers/createFileInDir');

const reactPathToDynamicImportModuleName = (path) =>
    path.replace('.', '').replace(/\//g, '_') + '.js';

// prevents getServerSideProps import during dynamic import
const buildClientSideDynamicImportModule = (
    projectRoot,
    dynamicImportModuleName,
    baseHandlerPath
) => {
    _path = path.join(projectRoot, '/_minimal-r/handlers');
    createFileInDir(
        _path,
        dynamicImportModuleName,
        `export {Component as default} from '${path
            .join(path.relative(_path, projectRoot), baseHandlerPath)
            .replace(/\\/g, '/')}';`
    );
};

const clientConfigHeader = `import React from 'react';
export const global = { firstRender: true };
const ReactLazyPreload = (importStatement) => {
    const Component = React.lazy(importStatement);
    Component.preload = async () => {
        const r = await importStatement();
        Component.preloaded = true;
        Component.preloadedResult = r.default;
    };
    return Component;
};\n`;

const buildConfig = async (config, projectRoot) => {
    const minimalRPath = path.join(projectRoot, '_minimal-r');
    const minimalRRelativePath = path.relative(minimalRPath, projectRoot);
    createDir(minimalRPath);

    let serverConfigImports = `export { Head } from '${path
        .join(minimalRRelativePath, config.components.Head)
        .replace(/\\/g, '/')}';\n`;

    let clientConfig = `${clientConfigHeader}

export const config = {
    routes: [
`;
    let serverConfig = `export const config = {
    routes: [
`;

    config.routes.forEach((route, i) => {
        if (i > 0) {
            if (route.type === 'react') clientConfig += ',\n';
            serverConfig += ',\n';
        }

        serverConfigImports += `import * as Route${i} from '${path
            .join(minimalRRelativePath, route.handler)
            .replace(/\\/g, '/')}';\n`;

        if (route.type === 'react') {
            const dynamicImportModuleName = reactPathToDynamicImportModuleName(route.handler);
            buildClientSideDynamicImportModule(projectRoot, dynamicImportModuleName, route.handler);
            clientConfig += `   {
        path: '${route.path}',
        Component: ReactLazyPreload(() => import('./handlers/${dynamicImportModuleName}')),
        useServerSideProps: ${(route.useServerSideProps || false).toString()}
    }`;
            serverConfig += `   {
        type: 'react',
        path: '${route.path}',
        Component: Route${i}.Component,
        getServerSideProps: Route${i}.getServerSideProps
    }`;
        } else {
            serverConfig += `   {
        type: 'node',
        path: '${route.path}',
        handler: Route${i}
    }`;
        }
    });
    clientConfig += `
   ]
};`;
    serverConfig += `
   ]
};`;

    createFileInDir(minimalRPath, 'config.client.js', clientConfig);
    createFileInDir(minimalRPath, 'config.server.js', `${serverConfigImports}\n${serverConfig}`);
};

module.exports = { buildConfig };
