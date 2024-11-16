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

test.set('Simplified Chinese with both full and half width chars', function () {
  const fixture = `这个大漆视频迟到了四年
“漆”同“柒”
我给这幅雕漆隐花的漆器作品取名“紫气东来”
麒麟回首，万事不愁
也把这份祝愿送给看到视频的每一个你，很想你们[心]
#李子柒紫气东来# #朝花柒拾# #焕新非遗计划# 李子柒的微博视频`
  const result = wrap(fixture, { width: 10 })
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  // console.log(charWidth, visualWidth)
  // console.log(result)
  a.deepEqual(
    result,
    [
      '这个大漆',   '视频迟到了',
      '四年',       '“漆”同“柒”',
      '我给这幅',   '雕漆隐花的',
      '漆器作品取', '名“紫气东',
      '来”',        '麒麟回首，',
      '万事不愁',   '也把这份',
      '祝愿送给',   '看到视频的',
      '每一个你，', '很想你们[',
      '心]',        '#李子柒紫',
      '气东来# #',  '朝花柒拾#',
      '#焕新非遗',  '计划# 李子',
      '柒的微博',   '视频'
    ]
  )
  a.equal(charWidth, 7)
  a.equal(visualWidth, 10)
})

test.set('Simplified Chinese with both full and half width chars, widthMode: visual', function () {
  const fixture = `这个大漆视频迟到了四年
“漆”同“柒”
我给这幅雕漆隐花的漆器作品取名“紫气东来”
麒麟回首，万事不愁
也把这份祝愿送给看到视频的每一个你，很想你们[心]
#李子柒紫气东来# #朝花柒拾# #焕新非遗计划# 李子柒的微博视频`
  const result = wrap(fixture, { width: 10, widthMode: 'visual' })
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  // console.log(charWidth, visualWidth)
  // console.log(result)
  a.deepEqual(
    result,
    [
      '这个大漆',   '视频迟到了',
      '四年',       '“漆”同“柒”',
      '我给这幅',   '雕漆隐花的',
      '漆器作品取', '名“紫气东',
      '来”',        '麒麟回首，',
      '万事不愁',   '也把这份',
      '祝愿送给',   '看到视频的',
      '每一个你，', '很想你们[',
      '心]',        '#李子柒紫',
      '气东来# #',  '朝花柒拾#',
      '#焕新非遗',  '计划# 李子',
      '柒的微博',   '视频'
    ]
  )
  a.equal(charWidth, 7)
  a.equal(visualWidth, 10)
})

test.set('Mixed languages, widthMode: visual', function () {
  const arabic = 'لما اتفرّقت العقول كل واحد عجبه عقله، ولما اتفرّقت الأرزاق ماحدش عجبه رزقه'
  const eng2 = 'A one-yard square must be drawn in the middle of the combat place, to which the “seconds”, after the fall of one of the contestants or at the beginning of the fight, must take their pupils, placing them face to face.'
  const chi2 = '有理走遍天下，无理寸步难行。'

  const result = wrap(arabic + eng2 + chi2, { width: 12, widthMode: 'visual' })
  const charWidth = Math.max(...result.map(l => l.length))
  const visualWidth = Math.max(...result.map(l => stringWidth(l)))
  // console.log(charWidth, visualWidth)
  // console.log(result)
  a.deepEqual(
    result,
    [
      'لما اتفرّقت',   'العقول كل',    'واحد عجبه',
      'عقله، ولما',   'اتفرّقت',       'الأرزاق',
      'ماحدش عجبه',   'رزقهA one-',   'yard square',
      'must be',      'drawn in the', 'middle of',
      'the combat',   'place, to',    'which the “',
      'seconds”,',    'after the',    'fall of one',
      'of the',       'contestants',  'or at the',
      'beginning of', 'the fight,',   'must take',
      'their pupils', ', placing',    'them face to',
      'face.有理',    '走遍天下，',   '无理寸步难行',
      '。'
    ]
  )
  a.equal(charWidth, 12)
  a.equal(visualWidth, 12)
})

test.set('Longer example', function () {
  const fixture = `1. A one-yard square must be drawn in the middle of the combat place, to which the “seconds”, after the fall of one of the contestants or at the beginning of the fight, must take their pupils, placing them face to face. While both are in said square they cannot hit each other.

2. That in order to avoid any discussion regarding the time that a contestant remained down, it is established that if the “second” does not take his principal to the aforementioned square within thirty seconds after he was knocked down, he is considered beaten.

3. That in the main matches no one can enter the place of the same (ring), except for the contestants and their “seconds”; The same rule applies to preliminary bouts, but in the latter, the referee is allowed, as long as he does not interfere in the bout, to enter the place of the bout, to ask for correction and to demand that the spectators take their places ; Anyone who violates these rules will be expelled from the place of the fight. When the wrestlers are ready for the fight and before the start of the fight, the place where it is held (ring) must be vacated.`
  const result = wrap(fixture, { width: 15 })
  const charWidth = Math.max(...result.map(l => l.length))
  // console.log(result)
  a.deepEqual(
    result,
    [
      '1. A one-yard',   'square must be',  'drawn in the',    'middle of the',
      'combat place,',   'to which the “',  'seconds”, after', 'the fall of',
      'one of the',      'contestants or',  'at the',          'beginning of',
      'the fight, must', 'take their',      'pupils, placing', 'them face to',
      'face. While',     'both are in',     'said square',     'they cannot hit',
      'each other.',     '',                '2. That in',      'order to avoid',
      'any discussion',  'regarding the',   'time that a',     'contestant',
      'remained down,',  'it is',           'established',     'that if the “',
      'second” does',    'not take his',    'principal to',    'the',
      'aforementioned',  'square within',   'thirty seconds',  'after he was',
      'knocked down,',   'he is',           'considered',      'beaten.',
      '',                '3. That in the',  'main matches no', 'one can enter',
      'the place of',    'the same (ring)', ', except for',    'the contestants',
      'and their “',     'seconds”; The',   'same rule',       'applies to',
      'preliminary',     'bouts, but in',   'the latter, the', 'referee is',
      'allowed, as',     'long as he does', 'not interfere',   'in the bout, to',
      'enter the',       'place of the',    'bout, to ask',    'for correction',
      'and to demand',   'that the',        'spectators take', 'their places ;',
      'Anyone who',      'violates these',  'rules will be',   'expelled from',
      'the place of',    'the fight. When', 'the wrestlers',   'are ready for',
      'the fight and',   'before the',      'start of the',    'fight, the',
      'place where it',  'is held (ring)',  'must be vacated', '.'
    ]
  )
  a.equal(charWidth, 15)
})

export { test, only, skip }
