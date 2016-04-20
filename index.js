'use strict'

module.exports = function() {
  return function * contentParser(next) {
    this.content = JSON.parse(this.message.content)
    yield next
  }
}
