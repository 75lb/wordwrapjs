/**
 * @module wordwrapjs
 */
import Column from './lib/column.js'

/**
 * @param {string}
 * @param options {object} - Options
 * @param options.locale {string} - Locale
 * @param options.granularity {string} - Gran
 * @alias module:wordwrapjs
 */
function wrap (text = '', options = {}) {
  const column = new Column(options)
  for (const s of segment(text, options)) {
    column.add(s.segment)
  }
  column.end()
  return column.lines
}

/**
 * @param {string}
 * @param {object} - Options
 */
function segment (text, options = {}) {
  const locale = options.locale
  const granularity = options.granularity || 'word' // grapheme, word, sentence
  const segmenter = new Intl.Segmenter(locale, { granularity })
  return Array.from(segmenter.segment(text))
}

export default wrap
