const express = require('express')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleWare = require('./utils/middleware')
const Person = require('./models/people')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(middleWare.requestLogger)
app.get('/api/persons', (_request, response, next) => {
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
				logger.info(`cant find ${request.params.id}`)
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.get('/info', (_request, response, next) => {
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
    .then(() => {
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
app.use(middleWare.unkownEndpoint)
app.use(middleWare.errorHandler)
const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`phonebook server running on port ${PORT}`)
})
