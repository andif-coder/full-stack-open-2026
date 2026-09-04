const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
loginRouter.post('/', async (request, response) => {
	const body = request.body;
	const user = await User.findOne({ username: body.username });
	console.log('cwj: ', user);
	const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);
	if (!passwordCorrect) {
		return response.status(401).json({
			error: 'invalid username or password'
		})
	}
	const userForToken = {
		username: user.username,
		id: user.id,
	};
	const token = jwt.sign(userForToken, process.env.SECRET);
	response.status(200).json({
		token,
		username: user.username,
		name: user.name
	})
})
module.exports = loginRouter
