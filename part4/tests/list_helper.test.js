const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('list_helper', () => {
	test('dummy returns one', () => {
		const blogs = []
		const ret = listHelper.dummy(blogs)
		assert.strictEqual(ret, 1)
	})
})
