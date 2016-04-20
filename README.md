# Stackrabbit Content Parser

[![Circle CI](https://circleci.com/gh/danethurber/stackrabbit-content-parser.svg?style=shield)](https://circleci.com/gh/danethurber/stackrabbit-content-parser)

Message content parsing middleware for stackrabbit

## Installation

```
npm install stackrabbit-content-parser
```

## Getting Started

```js
const stackrabbit = require('stackrabbit')
const contentParser = require('stackrabbit-content-parser')

const listener = stackrabbit({
  ...
})

listener.use(contentParser())

listener.listen(function * () {
  // this.content is now available
  console.log(this.content)
})

listener.connect()
```
