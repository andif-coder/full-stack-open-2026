const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user.js')
const assert = require('node:assert')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

describe('http test', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const userPromise = helper.initialUsers.map(async (u) => {
			const saltRound = 10;
			const passwordHash = await bcrypt.hash(u.password, saltRound);
			const userObj = new User({
				username: u.username,
				name: u.name,
				passwordHash: passwordHash
			});
			return userObj.save();
		});
		await Promise.all(userPromise);
	})
	test('check username length >= 3', async () => {
		const user = {
			username: "cw",
			name: "andwho",
			password: "112233"
		}
		const dataBefore = await api.get('/api/users');
		const ret = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)
		assert(ret.body.error.includes('username'));
		assert(ret.body.error.includes('characters'));
		const dataAfter = await api.get('/api/users');
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length);
	});
	test('check password length >= 3', async () => {
		const user = {
			username: "cwj",
			name: "andwho",
			password: "11"
		}
		const dataBefore = await api.get('/api/users');
		const ret = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)
		assert(ret.body.error.includes('password'));
		assert(ret.body.error.includes('characters'));
		const dataAfter = await api.get('/api/users');
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length);
	});
	test('check username & password is defined', async () => {
		const user = { name: "andwho" }
		const dataBefore = await api.get('/api/users');
		const ret = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)
		assert(ret.body.error.includes('password'));
		assert(ret.body.error.includes('username'));
		assert(ret.body.error.includes('given'));
		const dataAfter = await api.get('/api/users');
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length);
	});
	test('check username is unique', async () => {
		const user = {
			username: "root",
			name: "root",
			password: "112233"
		}
		const dataBefore = await api.get('/api/users');
		const ret = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)
		assert(ret.body.error.includes('unique'));
		const dataAfter = await api.get('/api/users');
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length);
	});
	test('add new user', async () => {
		const user = {
			username: "root1",
			name: "root1",
			password: "112233"
		}
		const dataBefore = await api.get('/api/users');
		await api
			.post('/api/users')
			.send(user)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		const dataAfter = await api.get('/api/users');
		assert.strictEqual(dataAfter.body.length, dataBefore.body.length + 1);
	});
	after(async () => {
		await mongoose.connection.close()
	})
})
