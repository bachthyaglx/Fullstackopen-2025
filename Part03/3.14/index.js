const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

morgan.token('person_data', function(req) {
  return req.body ? JSON.stringify(req.body) : ''
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person_data'))
app.use(express.static('build'))

let persons = [
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// app.get('/api/persons/:id', (request, response) => {
//   Person.findById(request.params.id).then(person => {
//     response.json(person)
//   })
// })

// app.get('/info', (request, response) => {
//   response.send(`
//     <p>Phonebook has info for ${Math.max(...persons.map(person => person.id))} people</p>
//     <p>${Date()}</p>
//   `)
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)
//   response.status(204).end()
// })

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})