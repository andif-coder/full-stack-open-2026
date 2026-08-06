const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/people')
const app = express()
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :response-time ms :body'))
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(p => {
      if (p) {
        response.json(p)
      } else {
        console.log(`cant find ${request.params.id}`)
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const now = new Date()
      const content = `
				<p>Phonebook has info for ${persons.length} people</p>
				<p>${now}</p>
			`
      response.send(content)
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(ret => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error =>	next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  Person.findById(request.params.id)
    .then(p => {
      if (!p) {
        return response.status(404).end()
      }
      p.name = body.name
      p.number = body.number
      return p.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message) // 统一打印错误堆栈信息
  // 1. 拦截特定错误：如果是 Mongo 的 ID 格式错误
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  // 2. 如果是其他未知的错误，继续交给 Express 内置的默认错误处理机制
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`phonebook server running on port ${PORT}`)
})
