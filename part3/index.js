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
app.get('/api/persons', (request, response) => {
	Person.find({})
		.then(persons => {
			response.json(persons)
		})
		.catch(error => {
			console.log('error getting phonebook: ', error.message)
		})
})
app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id)
		.then(p => {
			if (p) {
				response.json(p)
			} else {
				console.log(`cant find ${request.params.id}`)
				response.status(404).end()
			}
		})
		.catch(error => {
			console.log(`cant find ${request.params.id}, error: ${error.message}`)
			response.status(404).end()
		})
})
app.get('/info', (request, response) => {
	Person.find({})
		.then(persons => {
			const now = new Date()
			const content = `
				<p>Phonebook has info for ${persons.length} people</p>
				<p>${now}</p>
			`
			response.send(content)
		})
		.catch(error => {
			console.log('error getting phonebook: ', error.message)
		})
})
app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndDelete(request.params.id)
		.then(ret => {
			response.status(204).end()
		})
		.catch(error => {
			console.log(`can't delete ${request.params.id}, error: ${error.message}`)
			response.status(204).end()
		})
})
app.post('/api/persons', (request, response) => {
	const body = request.body
	if (body.name && body.number) {
		const newPerson = new Person({
			name: body.name,
			number: body.number,
		})
		newPerson.save()
			.then(savedPerson => {
				response.json(savedPerson)
			})
			.catch(error =>	{
				console.log(`error adding person ${body.name}, error: ${error.message}`)
			})
	} else {
		return response.status(400).json({
			error: "The name or number missing"
		})
	}
})
app.put('/api/persons/:id', (request, response) => {
	const body = request.body
	const person = {
		name: body.name,
		number: body.number,
	}
	Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
		.then(updatedPerson => {
			if (updatedPerson) {
				response.json(updatedPerson)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => {
				console.log(`error updating person ${body.name}, error: ${error.message}`)
		})
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`phonebook server running on port ${PORT}`)
})
