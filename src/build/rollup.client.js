const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

module.exports = {
    input: path.join(__dirname, '../client.tsx'),
    output: {
        dir: path.join(__dirname, '../../_minimal-r/client/build'),
        format: 'esm'
    },
    plugins: [
        commonjs(),
        nodeResolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        typescript({
            rollupCommonJSResolveHack: true,
            tsconfig: 'tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    module: 'esnext',
                    esModuleInterop: true,
                    jsx: 'react'
                },
                include: ['**/*'],
                files: ['src/client.tsx']
            }
        })
    ]
};
