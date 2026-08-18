const logger = require('../utils/logger')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
blogRouter.get('/', (_request, response, next) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})
blogRouter.post('/', (request, response, next) => {
  logger.info(request.body)
  const body = request.body
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  newBlog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})
module.exports = blogRouter
