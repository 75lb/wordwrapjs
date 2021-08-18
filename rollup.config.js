import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'wordwrapjs'
    },
    external: [],
    plugins: [resolve({ preferBuiltins: true })]
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      name: 'wordwrapjs'
    },
    plugins: [resolve({ preferBuiltins: true })]
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: [],
    plugins: [resolve({ preferBuiltins: true })]
  }
]
