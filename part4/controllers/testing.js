const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (_request, response) => {
	await User.deleteMany({})
	await Blog.deleteMany({})
	response.status(204).end()
})

module.exports = testingRouter
