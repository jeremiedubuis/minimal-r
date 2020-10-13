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

const buildConfig = async (config, projectRoot) => {
    const minimalRPath = path.join(projectRoot, '_minimal-r');
    createDir(minimalRPath);

    let serverConfigImports = '';

    let clientConfig = `
import React, { useState, useEffect } from 'react';
export const global = { firstRender: true };
const ReactLazyPreload = (importStatement) => {
    const Component = React.lazy(importStatement);
    Component.preload = async () => {
        const r = await importStatement();
        Component.preloaded = true;
        Component.preloadedResult = r.default;
    };
    return Component;
};

export const config = {
    routes: [
`;
    let serverConfig = `export const config = {
    routes: [
`;

    const relativePath = path.relative(__dirname, projectRoot);
    const minimalRRelativePath = path.relative(minimalRPath, projectRoot);
    config.routes.forEach((route, i) => {
        if (i > 0) {
            if (route.type === 'react') clientConfig += ',\n';
            serverConfig += ',\n';
        }

        serverConfigImports += `import * as Route${i} from '${path
            .join(relativePath, route.handler)
            .replace(/\\/g, '/')}';\n`;

        if (route.type === 'react') {
            const dynamicImportModuleName = reactPathToDynamicImportModuleName(route.handler);
            buildClientSideDynamicImportModule(projectRoot, dynamicImportModuleName, route.handler);
            clientConfig += `   {
        path: '${route.path}',
        Component: ReactLazyPreload(() => import('${minimalRRelativePath}/handlers/${dynamicImportModuleName}')),
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

    createFileInDir(path.join(minimalRPath, 'client'), 'config.js', clientConfig);
    createFileInDir(
        path.join(minimalRPath, 'server'),
        'config.js',
        `${serverConfigImports}\n${serverConfig}`
    );
};

module.exports = { buildConfig };
