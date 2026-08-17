// 请求输出中间件，可以输出每次请求的语句
const morgan = require('morgan')
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const requestLogger = morgan(':method :url :status :response-time ms :body')
// 错误处理中间件
const errorHandler = (error, _request, response, next) => {
  logger.error(error.message) // 统一打印错误堆栈信息
  // 1. 拦截特定错误：如果是 Mongo 的 ID 格式错误
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  // 2. 如果是其他未知的错误，继续交给 Express 内置的默认错误处理机制
  next(error)
}
// 路由兜底中间件，如果访问地址是不存在的话
const unkownEndpoint = (_request, response) => {
	response.status(404).send({ error: 'unkown endpoint' })
}
module.exports = {
	requestLogger,
	errorHandler,
	unkownEndpoint
}
