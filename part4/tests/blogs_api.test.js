const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const assert = require('node:assert')
const api = supertest(app)
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]
describe('http test', () => {
	beforeEach(async () => {
		// 清空集合中的所有旧数据
		await Blog.deleteMany({})
		await Blog.insertMany(initialBlogs)
	})
	test('blogs are returned as json', async () => {
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
		assert.strictEqual(response.body.length, initialBlogs.length)
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
			.send(blog)
			.expect(400)
		const dataAfter = await api.get('/api/blogs')
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length)
	})
	after(async () => {
		await mongoose.connection.close()
	})
})
