const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

const plugins = [
    commonjs(),
    typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
            compilerOptions: {
                module: 'esnext'
            }
        }
    })
];

if (process.env.NODE_ENV === 'production') plugins.push(terser());

module.exports = {
    input: path.join(__dirname, '../server.ts'),
    output: {
        dir: path.join(__dirname, '../../_minimal-r/server/build'),
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins
};
