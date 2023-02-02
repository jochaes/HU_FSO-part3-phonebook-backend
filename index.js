require('dotenv').config()
const express =  require('express') //The aplication imports Node's built in web server module
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

//Application
app.use(express.static('build'))
app.use(cors())


//Middleware
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

//Middleware
const unknownEndpoint = (request, response) => {
  console.log("Unknown endpoint request");
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())


app.get('/', 
  (request, response)=>{
    console.log("get index");
    response.send('<div><h1>Part 3: Phonebook Backend</h1><p><br>Made by @jochaes</p></div>')
  }
)

app.get('/info', (request, response)=>{
  console.log("Get Info");
  const len = persons.length
  const info = `Phonebook has info for ${len} people`
  const date = new Date()
  const resStr = `<div><p>${info}</p><p>${date}</p></div>`

  response.send(resStr)
  
})

app.get('/api/persons', (request, response)=>{

  Person.find({}).then(
    notes=>{
      response.json(notes)
    }
  )
})

app.get('/api/persons/:id', (request, response)=>{
  console.log("Get note");
  const id = Number(request.params.id)
  const person = persons.find( person => person.id === id )

  if(person){
    response.json(person)
  }else{
    response.statusMessage = "The person you're looking for, doesn't exists"
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response)=>{

  Person.findByIdAndRemove( request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error.message);
    })
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
}

app.post('/api/persons', (request, response)=>{

  const body = request.body 

  if(!body.number || !body.name){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // if( persons.find( person => person.name === body.name ) ){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }  

  const newPerson = new Person({
     name: body.name,
     number: body.number
  })

  //Save Person to the DB
  newPerson.save().then(
    savedPerson => {
      response.json(savedPerson)
    }
  )
})


app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
