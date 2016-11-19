'use strict'
var TestRunner = require('test-runner')
var TextBlock = require('../../')
var a = require('core-assert')

var runner = new TestRunner()
var bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."

runner.test('simple', function () {
  a.strictEqual(
    TextBlock.wrap(bars),
    "I'm rapping. I'm rapping. I'm\nrap rap rapping. I'm rap rap\nrap rap rappity rapping."
  )
})

runner.test('width', function () {
  a.strictEqual(
    TextBlock.wrap(bars, { width: 3 }),
    "I'm\nrapping.\nI'm\nrapping.\nI'm\nrap\nrap\nrapping.\nI'm\nrap\nrap\nrap\nrap\nrappity\nrapping."
  )
})

runner.skip('ignore', function () {
  a.strictEqual(
    wrap(bars, { ignore: "I'm" }),
    "I'm rapping. I'm rapping. I'm rap rap\nrapping. I'm rap rap rap rap\nrappity rapping."
  )
})

runner.test('TextBlock.lines', function () {
  a.deepStrictEqual(
    TextBlock.lines(bars),
    [ "I'm rapping. I'm rapping. I'm",
      "rap rap rapping. I'm rap rap",
      'rap rap rappity rapping.' ]
  )
})

runner.test('TextBlock.lines, width', function () {
  a.deepStrictEqual(
    TextBlock.lines(bars, { width: 3 }),
    [ "I'm",
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
      'rapping.' ]
  )
})

runner.test('TextBlock.lines, width smaller than content width', function () {
  a.deepStrictEqual(
    TextBlock.lines('4444', { width: 3 }),
    [ '4444' ]
  )
  a.deepStrictEqual(
    TextBlock.lines('onetwothreefour fivesixseveneight', { width: 7 }),
    [ 'onetwothreefour', 'fivesixseveneight' ]
  )
})

runner.test('TextBlock.lines, break', function () {
  a.deepStrictEqual(
    TextBlock.lines('onetwothreefour', { width: 7, break: true }),
    [ 'onetwot', 'hreefou', 'r' ]
  )
  a.deepStrictEqual(
    TextBlock.lines('\u001b[4m--------\u001b[0m', { width: 10, break: true, ignore: /\u001b.*?m/g }),
    [ '\u001b[4m--------\u001b[0m' ]
  )
  a.deepStrictEqual(
    TextBlock.lines(
      'onetwothreefour fivesixseveneight',
      { width: 7, break: true }
    ),
    [ 'onetwot', 'hreefou', 'r', 'fivesix', 'sevenei', 'ght' ]
  )
})

runner.test('TextBlock.lines(text): respect existing linebreaks', function () {
  a.deepStrictEqual(
    TextBlock.lines('one\ntwo three four', { width: 8 }),
    [ 'one', 'two', 'three', 'four' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('one \n \n two three four', { width: 8 }),
    [ 'one', '', 'two', 'three', 'four' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('one\r\ntwo three four', { width: 8 }),
    [ 'one', 'two', 'three', 'four' ]
  )
})

runner.test('TextBlock.lines(text): multilingual', function () {
  a.deepStrictEqual(
    TextBlock.lines('Può parlare più lentamente?', { width: 10 }),
    [ 'Può', 'parlare', 'più', 'lentamente?' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('один два три', { width: 4 }),
    [ 'один', 'два', 'три' ]
  )
})

runner.test('wrap hyphenated words', function () {
  a.deepStrictEqual(
    TextBlock.lines('ones-and-twos', { width: 5 }),
    [ 'ones-', 'and-', 'twos' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('ones-and-twos', { width: 10 }),
    [ 'ones-and-', 'twos' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('--------', { width: 5 }),
    [ '--------' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('--one --fifteen', { width: 5 }),
    [ '--one', '--fifteen' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('one-two', { width: 10 }),
    [ 'one-two' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('ansi-escape-sequences', { width: 22 }),
    [ 'ansi-escape-sequences' ]
  )

  a.deepStrictEqual(
    TextBlock.lines('one - two'),
    [ 'one - two' ]
  )
})

runner.test('isWrappable(input)', function () {
  a.strictEqual(TextBlock.isWrappable('one two'), true)
  a.strictEqual(TextBlock.isWrappable('one-two'), true)
  a.strictEqual(TextBlock.isWrappable('one\ntwo'), true)
})
