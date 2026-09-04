const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const errorHandler = (error, _request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: 'token invalid' })
  }
  next(error)
}
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const morgan = require('morgan')
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const tokenExtractor = (request, _response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '')
	} else {
		request.token = null
	}
	next();
}
const userExtractor = async (request, response, next) => {
	const token = request.token;
	if (!token) {
		return response.status(401).json({
			error: 'token missing'
		})
	}
	const { username, id } = jwt.verify(token, process.env.SECRET)
	request.user = await User.findById(id);
	next();
}
const requestLogger = morgan(':method :url :status :response-time ms :body')
module.exports = { errorHandler, unknownEndpoint, requestLogger, tokenExtractor, userExtractor }
