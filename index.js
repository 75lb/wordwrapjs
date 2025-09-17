/**
 * @module wordwrapjs
 */
import Column from './lib/column.js'

/**
 * @param {string}
 * @param options {object} - Options
 * @param options.locale {string} - Locale
 * @param options.granularity {string} - [Granularity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity). Possible values: grapheme, word or sentence.
 * @param options.width {number} - Number
 * @param options.widthMode {string} - 'char' or 'visual'
 * @param options.pad {boolean} - Set to true to pad each column cell so its width matches options.width
 * @param options.rtol {boolean} - Set to true if padding a rtol language.
 * @param options.noWrap {boolean} - Set to true to disable wrapping per segment
 */
export function wrap (text = '', options = {}) {
  const column = new Column(options)
  for (const s of segment(text, options)) {
    column.add(s.segment)
  }
  column.end()
  return column.lines
}

export function segment (text, options = {}) {
  const locale = options.locale
  const granularity = options.granularity || 'word' // grapheme, word, sentence
  const segmenter = new Intl.Segmenter(locale, { granularity })
  return Array.from(segmenter.segment(text))
}

