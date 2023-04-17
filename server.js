const express = require('express')
var morgan = require('morgan')
const app = express()
const PORT = 3001

app.use(express.json())
morgan.token('body', function (req, res) { return `${JSON.stringify(req.body)}` })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const entry = persons.find(person => person.id === id)

    if (entry) response.json(entry)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    const entries = persons.length
    const date = new Date()

    const output = `<p>Phonebook has info for ${entries} people</p>
    <p>${date}</p>`
    response.send(output)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const exists = persons.find(person => person.name === body.name)
    if (exists) return response.status(409).json({ error: `${body.name} already exists in server` })
    else {
        if (!body.name) {
            return response.status(400).json({ error: 'name is missing' })
        }
        if (!body.number) {
            return response.status(400).json({ error: 'number is missing' })
        }
        const num = Math.round(1000 * Math.random(10000))
        let entry = {
            id: num,
            name: body.name,
            number: body.name
        }
        persons.push(entry)
        response.json(entry)
    }
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})