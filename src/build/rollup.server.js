const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
    input: path.join(__dirname, '../server.ts'),
    output: {
        dir: path.join(__dirname, '../../_minimal-r/server/build'),
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins: [
        commonjs(),
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    module: 'esnext'
                }
            }
        })
    ]
};
