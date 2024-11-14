import Column from 'wordwrapjs/column'
import util from 'node:util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process.stdout.columns
util.inspect.defaultOptions.maxArrayLength = Infinity

function wrap (text = '', options = {}) {
  const locale = options.locale
  const granularity = options.granularity || 'word' // grapheme, word, sentence

  const segmenter = new Intl.Segmenter(locale, { granularity })
  const column = new Column(options)

  for (const s of segmenter.segment(text)) {
    column.add(s.segment)
  }
  column.end()
  return column
}

export default wrap

// const english = `1. A one-yard square must be drawn in the middle of the combat place, to which the “seconds”, after the fall of one of the contestants or at the beginning of the fight, must take their pupils, placing them face to face. While both are in said square they cannot hit each other.

// 2. That in order to avoid any discussion regarding the time that a contestant remained down, it is established that if the “second” does not take his principal to the aforementioned square within thirty seconds after he was knocked down, he is considered beaten.

// 3. That in the main matches no one can enter the place of the same (ring), except for the contestants and their “seconds”; The same rule applies to preliminary bouts, but in the latter, the referee is allowed, as long as he does not interfere in the bout, to enter the place of the bout, to ask for correction and to demand that the spectators take their places ; Anyone who violates these rules will be expelled from the place of the fight. When the wrestlers are ready for the fight and before the start of the fight, the place where it is held (ring) must be vacated.`
// const chinese = `这个大漆视频迟到了四年
// “漆”同“柒”
// 我给这幅雕漆隐花的漆器作品取名“紫气东来”
// 麒麟回首，万事不愁
// 也把这份祝愿送给看到视频的每一个你，很想你们[心]
// #李子柒紫气东来# #朝花柒拾# #焕新非遗计划# 李子柒的微博视频`


// const column = wrap(chinese+english, { widthMode: 'visual', width: 15, pad: true })
// console.log(column.lines)
// console.log(column.toString())

