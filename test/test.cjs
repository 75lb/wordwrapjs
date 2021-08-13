const TestRunner = require('test-runner')
const a = require('assert').strict
const wordwrap = require('wordwrapjs')

const tom = new TestRunner.Tom()

tom.test('Check module loads correctly from CommonJS', async function () {
  const result = wordwrap.wrap('one two three four one two three four one two three four')
  a.equal(result, 'one two three four one two\nthree four one two three four')
})

module.exports = tom
