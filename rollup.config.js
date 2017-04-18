import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import postcssModules from 'postcss-modules';
import cssnano from 'cssnano';
const cssExportMap = {};

const isDEV = process.env.NODE_ENV !== 'production';

export default {
  entry: isDEV ? './src/demo.js' : './src/index.js',
  targets: isDEV ? [
    { dest: 'dist/demo.js', format: 'umd' }
  ] : [
    { dest: 'dist/v-color.js', format: 'umd' },
    { dest: 'dist/v-color.common.js', format: 'cjs' },
    { dest: 'dist/v-color.esm.js', format: 'es' }
  ],
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'VColor',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    postcss({
      plugins: [
        postcssModules({
          getJSON(id, exportTokens) {
            cssExportMap[id] = exportTokens;
          },
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }),
        cssnano()
      ],
      getExport(id) {
        return cssExportMap[id];
      },
      extensions: ['.css']
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
};
