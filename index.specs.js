'use strict'

const expect = require('chai').expect
const sinon = require('sinon')
const stackrabbit = require('stackrabbit')

const contentParser = require('.')

describe('contentParser middleware', () => {
  it('should exist', () => {
    expect(contentParser).to.exist
    expect(contentParser).to.be.a('function')
  })

  it('should return stackrabbit middleware', () => {
    const middleware = contentParser()
    expect(middleware.constructor.name).to.eql('GeneratorFunction')
  })

  describe('with a valid message payload', () => {
    let app, context
    const content = {
      key: 'value',
      nested: {
        array: [1, 2, 3]
      }
    }
    const message = { content: new Buffer(JSON.stringify(content)) }

    beforeEach(function * () {
      app = stackrabbit({ rabbitUrl: 'asdf', queueName: 'qwer' })
      context = { app, message, onError: () => {} }

      sinon.stub(app, 'createContext').returns(context)

      app.use(contentParser())
      app.listen(function * (next) { yield next })

      yield app._composedStack(message)
    })

    afterEach(function * () {
      app.createContext.restore()
    })

    it('should parse the content to json', function * () {
      expect(context.content).to.exist
      expect(context.content).to.be.an('object')
      expect(context.content).to.eql(content)
    })
  })

  describe('with an invalid message payload', () => {
    let app, context, hasError
    const message = { content: new Buffer('invalid-json') }

    beforeEach(function * () {
      app = stackrabbit({ rabbitUrl: 'asdf', queueName: 'qwer' })
      context = { app, message, onError: () => {
        hasError = true
      } }

      sinon.stub(app, 'createContext').returns(context)

      app.use(contentParser())
      app.listen(function * (next) { yield next })

      yield app._composedStack(message)
    })

    afterEach(function * () {
      app.createContext.restore()
    })

    it('should throw', function * () {
      expect(hasError).to.be.true
    })
  })
})
