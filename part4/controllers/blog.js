const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})
blogRouter.post('/', async (request, response) => {
  const body = request.body;
	// check begin
	const user = body.user ? await User.findById(body.user) : await User.findOne({});
	if (user == null) {
		return response.status(400).json({
			error: 'user is null'
		})
	}
	// check end
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 'likes' in body ? body.likes : 0,
		user: user._id
  })
  const savedBlog = await blog.save()
	user.blogs = (user.blogs || []).concat(savedBlog._id);
	await user.save();
  response.status(201).json(savedBlog)
})
blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});
blogRouter.put('/:id', async (request, response) => {
	const body = request.body;
	const blog = await Blog.findById(request.params.id);
	if (!blog) {
		return response.status(404).end();
	}
	blog.likes = body.likes;
	const updatedBlog = await blog.save();
	response.status(200).json(updatedBlog);
})
module.exports = blogRouter
