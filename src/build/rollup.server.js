import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import ignoreImports from './rollup/ignoreImports';
import json from '@rollup/plugin-json';

import rimraf from 'rimraf';
rimraf.sync(path.join(__dirname, '../../_minimal-r/server'));

const plugins = [
    ignoreImports(['.scss', '.css']),
    commonjs(),
    json(),
    typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
            compilerOptions: {
                module: 'esnext'
            },
            files: ['src/server.ts']
        }
    })
];

if (process.env.NODE_ENV === 'production') plugins.push(terser());

export default {
    input: path.join(__dirname, '../server.ts'),
    output: {
        dir: path.join(__dirname, '../../_minimal-r/server/build'),
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins
};
