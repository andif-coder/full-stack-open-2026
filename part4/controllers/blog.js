const blogRouter = require('express').Router()
const Blog = require('../models/blog')
blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
	response.json(blogs)
})
blogRouter.post('/', async (request, response) => {
  const body = request.body;
	if (Array.isArray(body)) {
		const blogs = body.map((item)  => {
			return new Blog({
				title: item.title,
				author: item.author,
				url: item.url,
				likes: 'likes' in item ? item.likes : 0
			});
		})
		const savedBlogs = await Blog.insertMany(blogs);
		return response.status(201).json(savedBlogs)
	}
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 'likes' in body ? body.likes : 0
  })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})
blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});
module.exports = blogRouter
