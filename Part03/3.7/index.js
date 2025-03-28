const express = require('express')
const app = express()
const morgan = require('morgan')

const middleware_morgan = morgan('tiny');

app.use(express.json())
app.use(middleware_morgan)

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello and wellcome to REST Api !</h1>')
})
  
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {    
      response.json(person)  
  } else {    
      response.status(404).end()  
  }
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${Math.max(...persons.map(person => person.id))} people</p>
    <p>${Date()}</p>
  `)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const nameExists = persons.find(person => person.name.toLowerCase()===body.name.toLowerCase())

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  } else if (nameExists) {
    return response.status(400).json({ 
      error: 'The name already exists in the phonebook' 
    })
  }

  const person = {
      id: generateId(),
      name: body.name,
      number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})