import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import rimraf from 'rimraf';
import postcss from 'rollup-plugin-postcss';
import assets from './rollup/assets';

rimraf.sync(path.join(__dirname, '../../_minimal-r/client'));

const plugins = [
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    commonjs(),
    nodeResolve(),
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
    }),
    postcss({
        extract: true
    }),
    assets()
];

if (process.env.NODE_ENV === 'production') plugins.push(terser());

export default {
    input: path.join(__dirname, '../client.tsx'),
    output: {
        dir: path.join(__dirname, '../../_minimal-r/client/build'),
        format: 'esm'
    },
    plugins
};
