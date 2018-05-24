import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'

const NODE_ENV = process.env.NODE_ENV
const isDEV = NODE_ENV !== 'production'
const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  postcss({
    extract: false
  }),
  vue({
    css: false,
    compileTemplate: true
  }),
  commonjs(),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  buble({
    objectAssign: 'Object.assign'
  })
]

let options = [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
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
      sourcemap: true,
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
      sourcemap: true,
      strict: true
    },
    plugins
  }]
}

export default options
