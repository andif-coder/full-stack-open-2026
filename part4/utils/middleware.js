const logger = require('./logger')
const errorHandler = (error, _request, response, next) => {
	logger.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	}
	next(error)
}
const unkownEndpoint = (_request, response) => {
	response.status(404).send({ error: 'unkown endpoint' })
}
const morgan = require('morgan')
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const requestLogger = morgan(':method :url :status :response-time ms :body')
module.exports = { errorHandler, unkownEndpoint, requestLogger }
