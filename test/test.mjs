import wordwrap from 'wordwrapjs'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

/* A reference to https://www.youtube.com/watch?v=FGUjkvqkmQI */
const bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."

test.set('simple', function () {
  a.equal(
    wordwrap.wrap(bars),
    "I'm rapping. I'm rapping. I'm\nrap rap rapping. I'm rap rap\nrap rap rappity rapping."
  )
})

test.set('width', function () {
  a.equal(
    wordwrap.wrap(bars, { width: 3 }),
    "I'm\nrapping.\nI'm\nrapping.\nI'm\nrap\nrap\nrapping.\nI'm\nrap\nrap\nrap\nrap\nrappity\nrapping."
  )
})

skip.set('ignore', function () {
  a.equal(
    wordwrap.wrap(bars, { ignore: "I'm" }),
    "I'm rapping. I'm rapping. I'm rap rap\nrapping. I'm rap rap rap rap\nrappity rapping."
  )
})

test.set('wordwrap.lines', function () {
  a.deepEqual(
    wordwrap.lines(bars),
    ["I'm rapping. I'm rapping. I'm",
      "rap rap rapping. I'm rap rap",
      'rap rap rappity rapping.']
  )
})

test.set('wordwrap.lines, width', function () {
  a.deepEqual(
    wordwrap.lines(bars, { width: 3 }),
    ["I'm",
      'rapping.',
      "I'm",
      'rapping.',
      "I'm",
      'rap',
      'rap',
      'rapping.',
      "I'm",
      'rap',
      'rap',
      'rap',
      'rap',
      'rappity',
      'rapping.']
  )
})

test.set('wordwrap.lines, width smaller than content width', function () {
  a.deepEqual(
    wordwrap.lines('4444', { width: 3 }),
    ['4444']
  )
  a.deepEqual(
    wordwrap.lines('onetwothreefour fivesixseveneight', { width: 7 }),
    ['onetwothreefour', 'fivesixseveneight']
  )
})

test.set('wordwrap.lines, break', function () {
  a.deepEqual(
    wordwrap.lines('onetwothreefour', { width: 7, break: true }),
    ['onetwot', 'hreefou', 'r']
  )
  a.deepEqual(
    wordwrap.lines('\u001b[4m--------\u001b[0m', { width: 10, break: true, ignore: /\u001b.*?m/g }),
    ['\u001b[4m--------\u001b[0m']
  )
  a.deepEqual(
    wordwrap.lines(
      'onetwothreefour fivesixseveneight',
      { width: 7, break: true }
    ),
    ['onetwot', 'hreefou', 'r', 'fivesix', 'sevenei', 'ght']
  )
})

test.set('wordwrap.lines(text): respect existing linebreaks', function () {
  a.deepEqual(
    wordwrap.lines('one\ntwo three four', { width: 8 }),
    ['one', 'two', 'three', 'four']
  )

  a.deepEqual(
    wordwrap.lines('one \n \n two three four', { width: 8 }),
    ['one', '', 'two', 'three', 'four']
  )

  a.deepEqual(
    wordwrap.lines('one\r\ntwo three four', { width: 8 }),
    ['one', 'two', 'three', 'four']
  )
})

test.set('wordwrap.lines(text): multilingual', function () {
  a.deepEqual(
    wordwrap.lines('Può parlare più lentamente?', { width: 10 }),
    ['Può', 'parlare', 'più', 'lentamente?']
  )

  a.deepEqual(
    wordwrap.lines('один два три', { width: 4 }),
    ['один', 'два', 'три']
  )
})

test.set('wrap hyphenated words', function () {
  a.deepEqual(
    wordwrap.lines('ones-and-twos', { width: 5 }),
    ['ones-', 'and-', 'twos']
  )

  a.deepEqual(
    wordwrap.lines('ones-and-twos', { width: 10 }),
    ['ones-and-', 'twos']
  )

  a.deepEqual(
    wordwrap.lines('--------', { width: 5 }),
    ['--------']
  )

  a.deepEqual(
    wordwrap.lines('--one --fifteen', { width: 5 }),
    ['--one', '--fifteen']
  )

  a.deepEqual(
    wordwrap.lines('one-two', { width: 10 }),
    ['one-two']
  )

  a.deepEqual(
    wordwrap.lines('ansi-escape-sequences', { width: 22 }),
    ['ansi-escape-sequences']
  )

  a.deepEqual(
    wordwrap.lines('one - two'),
    ['one - two']
  )
})

test.set('isWrappable(input)', function () {
  a.equal(wordwrap.isWrappable('one two'), true)
  a.equal(wordwrap.isWrappable('one-two'), true)
  a.equal(wordwrap.isWrappable('one\ntwo'), true)
})

test.set('getChunks', function () {
  a.deepEqual(wordwrap.getChunks('one two three'), ['one', ' ', 'two', ' ', 'three'])
})

test.set('noTrim', function () {
  a.deepEqual(wordwrap.lines('word\n - word\n - word'), [
    'word', '- word', '- word'
  ])
  a.deepEqual(wordwrap.lines('word\n - word\n - word', { noTrim: true }), [
    'word', ' - word', ' - word'
  ])
})

test.set('wrapping text containing ansi escape sequences', function () {
  a.deepEqual(
    wordwrap.wrap('Generates something \u001b[3mvery\u001b[0m important.', { width: 35 }),
    'Generates something \u001b[3mvery\u001b[0m important.'
  )
})

test.set('non-string input', function () {
  a.equal(wordwrap.wrap(undefined), '')
  a.equal(wordwrap.wrap(function () {}), 'function () {}')
  a.equal(wordwrap.wrap({}), '[object Object]')
  a.equal(wordwrap.wrap(null), 'null')
  a.equal(wordwrap.wrap(true), 'true')
  a.equal(wordwrap.wrap(0), '0')
  a.equal(wordwrap.wrap(NaN), 'NaN')
  a.equal(wordwrap.wrap(Infinity), 'Infinity')
})

test.set('different eol', function () {
  a.equal(
    wordwrap.wrap(bars, { eol: 'LINE' }),
    "I'm rapping. I'm rapping. I'mLINErap rap rapping. I'm rap rapLINErap rap rappity rapping."
  )
})

export { test, only, skip }
