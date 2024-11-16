import { wrap, segment } from 'wordwrapjs'
import { strict as a } from 'assert'
import stringWidth from 'string-width'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.wrap(), defaults', function () {
  const fixture = 'That no contestant will be considered defeated.'
  const result = wrap(fixture)
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(
    result,
    ['That no contestant will be', 'considered defeated.']
  )
  a.equal(charWidth, 26)
  a.equal(visualWidth, 26)
})

test.set('.wrap(), width set', function () {
  const fixture = 'That no contestant will be considered defeated.'
  const result = wrap(fixture, { width: 10 })
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(
    result,
    [
      'That no',
      'contestant',
      'will be',
      'considered',
      'defeated.'
    ]
  )
  a.equal(charWidth, 10)
  a.equal(visualWidth, 10)
})

test.set('width smaller than some words: words not split', function () {
  const fixture = 'That no contestant will be considered defeated.'
  const result = wrap(fixture, { width: 3 })
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(
    result,
    [
      'That',       'no',
      'contestant', 'will',
      'be',         'considered',
      'defeated',   '.'
    ]
  )
  a.equal(charWidth, 10)
  a.equal(visualWidth, 10)
})

test.set('grapheme: words split', function () {
  const fixture = 'That no contestant will be considered defeated.'
  const result = wrap(fixture, { width: 3, granularity: 'grapheme' })
  // console.dir(result, { showHidden: true, depth: null, colors: true })
  a.deepEqual(
    result,
    [
      'Tha',        't n',
      'o c',        'ont',
      'est',        'ant',
      'wi',         'll',
      'be',         'con',
      'sid',        'ere',
      'd d',        'efe',
      'ate',        'd.'
    ]
  )
})

test.set('respect existing linebreaks', function () {
  const fixture = 'one\ntwo three four'
  const result = wrap(fixture, { width: 3 })
  // console.dir(result, { showHidden: true, depth: null, colors: true })
  a.deepEqual(
    result,
    ['one', 'two', 'three', 'four']
  )
})

test.set('respect existing linebreaks 2', function () {
  const fixture = 'one\n\ntwo three four'
  const result = wrap(fixture, { width: 3 })
  // console.dir(result, { showHidden: true, depth: null, colors: true })
  a.deepEqual(
    result,
    ['one', '', 'two', 'three', 'four']
  )
})

skip.set('Double-width unicode characters', function () {
  const width = 10
  const fixture = '基于gulp和 browserify 的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'browserify', '的项', '目构建', '工具'])
})

skip.set('Double-width unicode characters 2', function () {
  const width = 10
  const fixture = '基于gulp和 one two tt 的项的项的项的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'one two', 'tt', '的项的项的项的项', '目构建', '工具'])
})

skip.set('Double-width unicode characters: break mode 1', function () {
  const width = 10
  const fixture = '基于gulp和 one two tt 的项的项的项的项 目构建 工具'
  const result = wordwrap.lines(fixture, { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'one two', 'tt', '的项的项的', '项的项', '目构建', '工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

skip.set('Double-width unicode characters: break mode 2', function () {
  const width = 10
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp和', 'browserify', '的项目构建', '工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

skip.set('Double-width unicode characters: break mode 3', function () {
  const width = 9
  const result = wordwrap.lines('基于gulp和browserify的项目构建工具', { width, break: true })
  const maxLetterLength = Math.max(...result.map(l => l.length))
  const maxLetterVisualWidth = Math.max(...result.map(l => stringWidth(l)))
  a.deepEqual(result, ['基于gulp', '和browser', 'ify的项目', '构建工具'])
  a.ok(maxLetterLength <= width)
  a.ok(maxLetterVisualWidth <= width)
})

skip.set('Double-width unicode characters: break mode 3', function () {
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

skip.set('Width of 1 smaller than the minimum visual width (2)', function () {
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

skip.set('wrap hyphenated words', function () {
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

skip.set('Simplified Chinese word wrapping', async function () {
  const fixture = '有理走遍天下，无理寸步难行。'
  a.deepEqual(
    wordwrap.lines(fixture, { width: 6, locale: 'zh-CN' }),
    ['有理', '走遍', '天下，', '无理', '寸步难', '行。']
  )
})

skip.set('Simplified Chinese word wrapping, break', async function () {
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

skip.set('English word wrapping', async function () {
  const fixture = 'That no contestant will be considered defeated.'
  a.deepEqual(
    wordwrap.lines(fixture, { width: 10 }),
    ['That no', 'contestant', 'will be', 'considered', 'defeated.']
  )
})

skip.set('English word wrapping, longer', async function () {
  const fixture = `1. A one-yard square must be drawn in the middle of the combat place, to which the “seconds”, after the fall of one of the contestants or at the beginning of the fight, must take their pupils, placing them face to face. While both are in said square they cannot hit each other.

2. That in order to avoid any discussion regarding the time that a contestant remained down, it is established that if the “second” does not take his principal to the aforementioned square within thirty seconds after he was knocked down, he is considered beaten.

3. That in the main matches no one can enter the place of the same (ring), except for the contestants and their “seconds”; The same rule applies to preliminary bouts, but in the latter, the referee is allowed, as long as he does not interfere in the bout, to enter the place of the bout, to ask for correction and to demand that the spectators take their places ; Anyone who violates these rules will be expelled from the place of the fight. When the wrestlers are ready for the fight and before the start of the fight, the place where it is held (ring) must be vacated.`
  console.log(wordwrap.wrap(fixture, { width: 20 }))
})

skip.set('URL', async function () {
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
