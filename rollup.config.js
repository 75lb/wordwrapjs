const resolve = require('rollup-plugin-node-resolve')

module.exports = [
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'wordwrapjs'
    },
    external: [],
    plugins: [resolve({ preferBuiltins: true })]
  },
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: [],
    plugins: [resolve({ preferBuiltins: true })]
  }
]
