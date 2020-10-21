import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'

const NODE_ENV = process.env.NODE_ENV
const DEVELOPMENT = NODE_ENV !== 'production'
const SOURCES = [
  {
    name: 'VColor',
    input: path.resolve(__dirname, './src/index.js'),
    output: 'index',
  },
  {
    name: 'VColorPicker',
    input: path.resolve(__dirname, './src/VColorPicker.vue'),
    output: 'VColorPicker',
  },
  {
    name: 'VColorPopover',
    input: path.resolve(__dirname, './src/VColorPopover.vue'),
    output: 'VColorPopover',
  }
]
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

if (!DEVELOPMENT) {
  plugins.push(terser())
}

const optionsFactory = ({ name, input, output }) => [
  {
    input,
    output: {
      file: `dist/${output}.esm.js`,
      format: 'es',
      strict: true
    },
    external: id => /^lodash/.test(id),
    plugins
  },
  {
    input,
    output: {
      file: `dist/${output}.js`,
      format: 'umd',
      name,
      strict: true
    },
    plugins
  }
]

let options = SOURCES.map(optionsFactory).flat()

if (DEVELOPMENT) {
  options = [
    {
      input: './demo.js',
      output: {
        file: 'dist/demo.js',
        format: 'umd',
        strict: true
      },
      plugins,
    }
  ]
}

export default options
