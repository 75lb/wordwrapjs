import Column from 'wordwrapjs/column'

function wrap (text = '', options = {}) {
  const column = new Column(options)
  for (const s of segment(text, options)) {
    column.add(s.segment)
  }
  column.end()
  return column.lines
}

function segment (text, options = {}) {
  const locale = options.locale
  const granularity = options.granularity || 'word' // grapheme, word, sentence
  const segmenter = new Intl.Segmenter(locale, { granularity })
  return Array.from(segmenter.segment(text))
}

export { wrap, segment }
