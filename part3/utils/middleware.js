const morgan = require('morgan')
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const requestLogger = morgan(':method :url :status :response-time ms :body')

module.exports = {
	requestLogger
}
