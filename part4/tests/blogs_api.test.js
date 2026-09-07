const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const api = supertest(app)
describe('http test', () => {
	let token = null;
	beforeEach(async () => {
		// 清空集合中的所有旧数据
		await Blog.deleteMany({})
		await User.deleteMany({})
		// Get Token
		const testUser = { username: 'test_root', password: '112233' };
		await api.post('/api/users').send(testUser);
		const userGetResponse = await api.post('/api/login').send(testUser);
		token = userGetResponse.body.token;
		// insert initial blogs
		for (const blog of helper.initialBlogs) {
			await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${token}`)
				.send(blog)
		}
	})
	test('blogs are returned as json', async () => {
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})
	test('id but not __id', async () => {
		const response = await api.get('/api/blogs')
		response.body.forEach((r) => {
			assert.strictEqual(Object.hasOwn(r, '_id'), false)
			assert.strictEqual(Object.hasOwn(r, 'id'), true)
			assert.strictEqual(typeof r.id, 'string')
		})
	})
	test('a valid can be used', async () => {
		const newBlog = {
			_id: "5a422bc61b54a676234d17fd",
    	title: "GOAT KOBE",
    	author: "cwj",
    	url: "http://www.cwj.com",
    	likes: 6,
    	__v: 0
		}
		const dataBefore = await api.get('/api/blogs')
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		const response = await api.get('/api/blogs')
		const titles = response.body.map(r => r.title)
		const author = response.body.map(r => r.author)
		assert.strictEqual(response.body.length, dataBefore.body.length + 1)
		assert(titles.includes('GOAT KOBE'))
		assert(author.includes('cwj'))
	})
	test('obj without likes', async () => {
		const blog = {
			_id: "5a422bc61b54a676234d17fe",
    	title: "GOAT Jordan",
    	author: "cwj",
    	url: "http://www.cwj.com",
    	__v: 0
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(blog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		const newBlog = await Blog.findById(response.body.id)
		assert.strictEqual(newBlog.likes, 0)
	})
	test('obj without title', async () => {
		const blog = {
			_id: "5a422bc61b54a676234d17ff",
    	author: "cwj",
    	url: "http://www.cwj.com",
			likes: 1,
    	__v: 0
		}
		const dataBefore = await api.get('/api/blogs')
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(blog)
			.expect(400)
		const dataAfter = await api.get('/api/blogs')
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length)
	})
	test('obj without url', async () => {
		const blog = {
			_id: "5a422bc61b54a676234d1711",
    	title: "GOAT Jordan",
    	author: "cwj",
			likes: 1,
    	__v: 0
		}
		const dataBefore = await api.get('/api/blogs')
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(blog)
			.expect(400)
		const dataAfter = await api.get('/api/blogs')
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length)
	})
	test('del obj', async () => {
		const dataBefore = await api.get('/api/blogs')
		const id = dataBefore.body[0].id;
		await api
			.delete(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)
		const dataAfter = await api.get('/api/blogs')
		assert.strictEqual(dataAfter.body.length + 1, dataBefore.body.length)
		const idAfter = dataAfter.body.map(r => r.id);
		assert(!idAfter.includes(id));
	})
	test('put obj', async () => {
		const dataBefore = await api.get('/api/blogs')
		const id = dataBefore.body[0].id;
		const blog = { ...dataBefore.body[0], likes: 99 };
		await api
			.put(`/api/blogs/${id}`)
			.send(blog)
			.expect(200)
		const dataAfter = await api.get('/api/blogs')
		const idLikesAfter = dataAfter.body.map(r => ({id: r.id, likes: r.likes}));
		const blogAfter = idLikesAfter.find(b => { return b.id === id });
		assert(blogAfter.likes == 99);
	})
	test('post without token', async () => {
		const blog = {
			_id: "3a422bc61b54a676234d1711",
    	title: "GOAT Jordan Mini",
    	author: "cwj_mini",
			likes: 0,
    	__v: 0
		}
		const dataBefore = await api.get('/api/blogs')
		await api
			.post('/api/blogs')
			.send(blog)
			.expect(401)
		const dataAfter = await api.get('/api/blogs')
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length)
	})
	after(async () => {
		await mongoose.connection.close()
	})
})
