import wordwrap from 'wordwrapjs'
import { strict as a } from 'assert'
import stringWidth from 'string-width'

const [test, only, skip] = [new Map(), new Map(), new Map()]

/* A reference to https://www.youtube.com/watch?v=FGUjkvqkmQI */
const bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping."

test.set('.wrap(), defaults', function () {
  a.equal(
    wordwrap.wrap(bars),
    "I'm rapping. I'm rapping. I'm\nrap rap rapping. I'm rap rap\nrap rap rappity rapping."
  )
})

test.set('width', function () {
  // console.dir(wordwrap.wrap(bars, { width: 3 }))
  a.equal(
    wordwrap.wrap(bars, { width: 3 }),
    "I'm\n" +
      'rapping\n' +
      '.\n' +
      "I'm\n" +
      'rapping\n' +
      '.\n' +
      "I'm\n" +
      'rap\n' +
      'rap\n' +
      'rapping\n' +
      '.\n' +
      "I'm\n" +
      'rap\n' +
      'rap\n' +
      'rap\n' +
      'rap\n' +
      'rappity\n' +
      'rapping\n' +
      '.'
  )
})

test.set('.lines(), defaults', function () {
  // console.log(wordwrap.lines(bars))
  a.deepEqual(
    wordwrap.lines(bars),
    ["I'm rapping. I'm rapping. I'm",
      "rap rap rapping. I'm rap rap",
      'rap rap rappity rapping.']
  )
})

test.set('wordwrap.lines, width', function () {
  // console.dir(wordwrap.lines(bars, { width: 3 }), { showHidden: true, depth: null, colors: true })
  a.deepEqual(
    wordwrap.lines(bars, { width: 3 }),
    [
      "I'm", 'rapping',
      '.', "I'm",
      'rapping', '.',
      "I'm", 'rap',
      'rap', 'rapping',
      '.', "I'm",
      'rap', 'rap',
      'rap', 'rap',
      'rappity', 'rapping',
      '.'
    ]
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
    wordwrap.lines(
      'onetwothreefour fivesixseveneight',
      { width: 7, break: true }
    ),
    ['onetwot', 'hreefou', 'r', 'fivesix', 'sevenei', 'ght']
  )
})

skip.set('wordwrap.lines, break, ansi-escape-sequences', function () {
  a.deepEqual(
    wordwrap.lines('\u001b[4m--------\u001b[0m', { width: 10, break: true, ignore: /\u001b.*?m/g }),
    ['\u001b[4m--------\u001b[0m']
  )
})

test.set('wordwrap.lines(text): respect existing linebreaks', function () {
  a.deepEqual(
    wordwrap.lines('one\ntwo three four', { width: 8 }),
    ['one', 'two', 'three', 'four']
  )
})

test.set('wordwrap.lines(text): respect existing linebreaks 2', function () {
  a.deepEqual(
    wordwrap.lines('First paragraph.\n\nSecond paragraph.', { width: 18 }),
    ['First paragraph.', '', 'Second paragraph.']
  )
})

test.set('wordwrap.lines(text): respect existing linebreaks 3', function () {
  a.deepEqual(
    wordwrap.lines('one\r\ntwo three four', { width: 8 }),
    ['one', 'two', 'three', 'four']
  )
})

test.set('wordwrap.lines(text): multilingual', function () {
  a.deepEqual(
    wordwrap.lines('Può parlare più lentamente?', { width: 10 }),
    ['Può', 'parlare', 'più', 'lentamente', '?']
  )

  a.deepEqual(
    wordwrap.lines('один два три', { width: 4 }),
    ['один', 'два', 'три']
  )
})

test.set('Double-width unicode characters', function () {
  const width = 10
  const fixture = '基于gulp和 browserify 的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'browserify', '的项', '目构建', '工具'])
})

test.set('Double-width unicode characters 2', function () {
  const width = 10
  const fixture = '基于gulp和 one two tt 的项的项的项的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'one two', 'tt', '的项的项的项的项', '目构建', '工具'])
})

test.set('Double-width unicode characters: break mode 1', function () {
  const width = 10
  const fixture = '基于gulp和 one two tt 的项的项的项的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'one two', 'tt', '的项的项的', '项的项', '目构建', '工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

test.set('Double-width unicode characters: break mode 2', function () {
  const width = 10
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'browserify', '的项目构建', '工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

test.set('Double-width unicode characters: break mode 3', function () {
  const width = 9
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp', '和browser', 'ify的项目', '构建工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

test.set('Double-width unicode characters: break mode 3', function () {
  const width = 2
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, [
    '基', '于', 'gu', 'lp',
    '和', 'br', 'ow', 'se',
    'ri', 'fy', '的', '项',
    '目', '构', '建', '工',
    '具'
  ])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

test.set('Width of 1 smaller than the minimum visual width (2)', function () {
  const width = 1
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, [
    '基', '于', 'g', 'u', 'l',
    'p', '和', 'b', 'r', 'o',
    'w', 's', 'e', 'r', 'i',
    'f', 'y', '的', '项', '目',
    '构', '建', '工', '具'
  ])
  a.ok(maxLetterLength <= width)
  /* It's impossible to break wide-character letters down any less than 2 */
  a.ok(maxLetterVisualWidth <= 2)
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
    ['-----', '---']
  )

  a.deepEqual(
    wordwrap.lines('--one --fifteen', { width: 5 }),
    ['--one', '--', 'fifteen']
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
  a.equal(wordwrap.isWrappable('onetwo'), false)
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

test.set('Simplified Chinese word wrapping', async function () {
  const fixture = '有理走遍天下，无理寸步难行。'
  a.deepEqual(
    wordwrap.lines(fixture, { width: 6, locale: 'zh-CN' }),
    ['有理', '走遍', '天下，', '无理', '寸步难', '行。']
  )
})

test.set('Simplified Chinese word wrapping, break', async function () {
  const fixture = '有理走遍天下，无理寸步难行。'
  a.deepEqual(
    wordwrap.lines(fixture, { width: 2, locale: 'zh-CN', break: true }),
    [
      '有', '理', '走',
      '遍', '天', '下',
      '，', '无', '理',
      '寸', '步', '难',
      '行', '。'
    ]
  )
})

test.set('English word wrapping', async function () {
  const fixture = 'That no contestant will be considered defeated.'
  a.deepEqual(
    wordwrap.lines(fixture, { width: 10 }),
    ['That no', 'contestant', 'will be', 'considered', 'defeated.']
  )
})

test.set('English word wrapping, longer', async function () {
  const fixture = `1. A one-yard square must be drawn in the middle of the combat place, to which the “seconds”, after the fall of one of the contestants or at the beginning of the fight, must take their pupils, placing them face to face. While both are in said square they cannot hit each other.

2. That in order to avoid any discussion regarding the time that a contestant remained down, it is established that if the “second” does not take his principal to the aforementioned square within thirty seconds after he was knocked down, he is considered beaten.

3. That in the main matches no one can enter the place of the same (ring), except for the contestants and their “seconds”; The same rule applies to preliminary bouts, but in the latter, the referee is allowed, as long as he does not interfere in the bout, to enter the place of the bout, to ask for correction and to demand that the spectators take their places ; Anyone who violates these rules will be expelled from the place of the fight. When the wrestlers are ready for the fight and before the start of the fight, the place where it is held (ring) must be vacated.`
  console.log(wordwrap.wrap(fixture, { width: 20 }))
})

test.set('English word wrapping: break', async function () {
  const fixture = 'That no contestant will be considered defeated.'
  a.deepEqual(wordwrap.lines(fixture, { width: 4, break: true }), [
    'That', 'no', 'cont',
    'esta', 'nt', 'will',
    'be', 'cons', 'ider',
    'ed', 'defe', 'ated',
    '.'
  ])
})

test.set('English hyphenated', async function () {
  const fixture = 'One-two, three, four-four-two, eight.'
  this.data = wordwrap.lines(fixture, { width: 14 })
})

test.set('English hyphenated, wrap', async function () {
  const fixture = 'One-two, three, four-four-two, eight.'
  console.log(wordwrap.wrap(fixture, { width: 14 }))
})

test.set('URL', async function () {
  const width = 14
  const fixture = 'https://www.dailymail.co.uk/tvshowbiz/article-14075423/ariana-grande-nyc-weight-loss-concern-wicked-premiere.html'
  const result = wordwrap.lines(fixture, { width })
  console.log(result)
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  console.log(width, charWidth, visualWidth)
})

test.set('URL, break', async function () {
  const width = 14
  const fixture = 'https://www.dailymail.co.uk/tvshowbiz/article-14075423/ariana-grande-nyc-weight-loss-concern-wicked-premiere.html'
  const result = wordwrap.lines(fixture, { width, break: true })
  console.log(result)
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  console.log(width, charWidth, visualWidth)
})

only.set('URL', async function () {
  const width = 14
  const fixture = `这个大漆视频迟到了四年
“漆”同“柒”
我给这幅雕漆隐花的漆器作品取名“紫气东来”
麒麟回首，万事不愁
也把这份祝愿送给看到视频的每一个你，很想你们[心]
#李子柒紫气东来# #朝花柒拾# #焕新非遗计划# 李子柒的微博视频`
  const result = wordwrap.lines(fixture, { width, break: true })
  console.log(result)
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  console.log(width, charWidth, visualWidth)
})



export { test, only, skip }
