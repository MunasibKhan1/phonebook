// lets import express and assign it to a variable
const express = require('express')
// create an app variable as express instance
const app = express()
// import morgan library for logs
const morgan = require('morgan')

// import cors to module
const cors = require('cors') // 3.9

// create a morgan token for data | 3.7 , 3.8
morgan.token('data', (req, res) => JSON.stringify({name:req.body.name, number:req.body.number}))

// MIDDLEWARES
app.use(express.static('build')) // add the react app from build folder
app.use(express.json()) // parsing json
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) // morgan to print logs | 3.7, 3.8
app.use(cors()) // using cors | 3.9


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

// this will get all the persons and numbers of the phonebook | 3.1
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// route for info | 3.1
app.get('/info', (request, response) => {
    const phonebook_size = persons.length
    const date = new Date()

    response.send(`
       
        <p>Phonebook has infor for ${phonebook_size} people</p>
        <p>${date}</p>
        `
    )
})

// this will get a particular person in the phonebook | 3.3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person){
        
        response.json(person)
    }
    else {
        response.status(404).end()   
    }
})

// this will delete a person from the phonebook | 3.4 
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (persons){
        persons = persons.filter(p => p.id !== id)
        response.json({message: "persons deleted"}).end()
    }
    else {
        response.json({message: "person with this doesn't exists"}).end()
    }

})

// this will add a new persons | 3.5
// function to create random id 
const randomId = () => Math.round(Math.random()*100000)
app.post('/api/persons', (request, response) => {
    const body = request.body
    // exercise 3.6
    if (!body.name){
       return response.status(400).json({error: "name is missing"})
    }
    else if (!body.number) {
        return response.status(400).json({error: "number is missing"})
    }
    // see if the person name already exists in the phonebook
    const person = persons.find(p => p.name === body.name)
    if (person){
       return response.status(400).json({error: "name must be unique"})
    }
    else {
        // create new person object
        const newPerson = {
            id: randomId(), // assign random id
            name: body.name,
            number: body.number
        }
        persons = persons.concat(newPerson)
        response.json(persons)
    }
})

// this will put the app on server 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})