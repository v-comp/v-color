import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

const NODE_ENV = process.env.NODE_ENV
const isDEV = NODE_ENV !== 'production'
const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  commonjs(),
  resolve(),
  vue({
    style: {
      postcssPlugins: [
        require('postcss-nested')
      ]
    }
  }),
]

let options = [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      // sourcemap: true,
      strict: true
    },
    external: id => /^lodash/.test(id),
    plugins
  },
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'VColor',
      // sourcemap: true,
      strict: true
    },
    plugins
  }
]

if (isDEV) {
  options = [{
    input: './demo.js',
    output: {
      file: 'dist/demo.js',
      format: 'umd',
      // sourcemap: true,
      strict: true
    },
    plugins
  }]
}

export default options
