const logger = require('../utils/logger')
const peopleRouter = require('express').Router()
const Person = require('../models/people')
peopleRouter.get('/', (_request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})
peopleRouter.get('/:id', (request, response, next) => {
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
peopleRouter.get('/info', (_request, response, next) => {
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
peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
peopleRouter.post('/', (request, response, next) => {
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
peopleRouter.put('/:id', (request, response, next) => {
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
module.exports = peopleRouter
