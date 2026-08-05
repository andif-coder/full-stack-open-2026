const express = require('express')
const morgan = require('morgan')
const app = express()
morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :response-time ms :body'))
let persons = [
	{ 
	  "id": "1",
	  "name": "Arto Hellas", 
	  "number": "040-123456"
	},
	{ 
	  "id": "2",
	  "name": "Ada Lovelace", 
	  "number": "39-44-5323523"
	},
	{ 
	  "id": "3",
	  "name": "Dan Abramov", 
	  "number": "12-43-234345"
	},
	{ 
	  "id": "4",
	  "name": "Mary Poppendieck", 
	  "number": "39-23-6423122"
	}
]
app.get('/api/persons', (request, response) => {
	response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
	const id = String(request.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})
app.get('/info', (request, response) => {
	const now = new Date()
	const content = `
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${now}</p>
	`
	response.send(content)
})
app.delete('/api/persons/:id', (request, response) => {
	const id = String(request.params.id)
	persons = persons.filter(p => p.id !== id)
	response.status(204).end()
})
const generateId = () => {
	const newId = Math.floor(Math.random() * 1000000)
	return String(newId)
}
app.post('/api/persons', (request, response) => {
	const body = request.body
	if (body.name && body.number) {
		const exist = persons.find(p => p.name === body.name)
		if (exist) {
			return response.status(400).json({
				error: "The name already exists in the phonebook"
			})
		}
		const newPerson = {
			name: body.name,
			number: body.number,
			id: generateId()
		}
		persons = persons.concat(newPerson)
		response.json(newPerson)
	} else {
		return response.status(400).json({
			error: "The name or number missing"
		})
	}
})
app.put('/api/persons/:id', (request, response) => {
	const body = request.body
	console.log(body)
	const id = String(request.params.id)
	console.log(id)
	persons = persons.map(p => p.id === id ? body : p)
	response.json(body)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`phonebook server running on port ${PORT}`)
})
