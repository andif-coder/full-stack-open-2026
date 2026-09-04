const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
userRouter.get('/', async (_request, response) => {
  const users = await User.find({})
	response.json(users)
})
userRouter.post('/', async (request, response) => {
  const body = request.body;
	// check begin
	const checkDefined = (value) => typeof value === 'string';
	const checkLength = (value) => value.length >= 3;
	if (!checkDefined(body.username) || !checkDefined(body.password)) {
		return response.status(400).json({
			error: 'username or password must be given'
		});
	}
	if (!checkLength(body.username) || !checkLength(body.password)) {
		return response.status(400).json({
			error: 'username or password must be at least 3 characters long'
		});
	}
	const exist = await User.findOne({ username: body.username });
	if (exist) {
		return response.status(400).json({
			error: 'username must be unique'
		});
	}
	// check end
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
		username: body.username,
		name: body.name,
		passwordHash: passwordHash
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
module.exports = userRouter
