import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import ttypescript from 'ttypescript';

export default {
  input: './src/Stats.ts',
  plugins: [
    typescript({
      typescript: ttypescript,
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve({ browser: true }),
    commonjs({ include: 'node_modules/**', sourceMap: false }),
  ],
  output: [
    {
      name: 'Stats',
      file: 'build/stats.module.js', // a path to the bundled file
      format: 'es', // use ES Module
      sourcemap: false,
    },
    {
      format: 'umd',
      name: 'Stats',
      file: 'build/stats.js',
      indent: '\t',
    },
  ],
};
