const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleWare = require('../utils/middleware')
blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})
blogRouter.post('/', middleWare.userExtractor, async (request, response) => {
  const body = request.body;
	// check begin
	const user = request.user;
	if (user == null) {
		return response.status(401).json({
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
	await savedBlog.populate('user', { username: 1, name: 1 })
	user.blogs = (user.blogs || []).concat(savedBlog._id);
	await user.save();
  response.status(201).json(savedBlog)
})
blogRouter.delete('/:id', middleWare.userExtractor, async (request, response) => {
	// check begin
	const blog = await Blog.findById(request.params.id);
	if (!blog) {
		return response.status(404).json({
			error: 'blog isn\'t exist'
		})
	}
	const user = request.user;
	if (!user || (user._id.toString() != blog.user.toString())) {
		return response.status(401).json({
			error: 'user is uncorrect'
		})
	}
	// check end
	await Blog.findByIdAndDelete(request.params.id);
	user.blogs = user.blogs.filter(b => b.toString() !== request.params.id);
	await user.save();
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
	await updatedBlog.populate('user', { username: 1, name: 1 })
	response.status(200).json(updatedBlog);
})
module.exports = blogRouter
