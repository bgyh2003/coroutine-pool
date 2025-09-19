// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const input = 'src/index.ts';
const plugins = [
    json(),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser()
];

export default [

    // CommonJS
    {
        input,
        output: {
            file: pkg.main, // "dist/index.cjs.js"
            format: 'cjs',
            sourcemap: true
        },
        plugins
    },

    // ESModule
    {
        input,
        output: {
            file: pkg.module, // "dist/index.esm.js"
            format: 'esm',
            sourcemap: true
        },
        plugins
    },

    // UMD
    {
        input,
        output: {
            name: 'MyLib', // 全局变量名
            file: pkg.browser, // "dist/index.umd.js"
            format: 'umd',
            sourcemap: true
        },
        plugins
    }

];
