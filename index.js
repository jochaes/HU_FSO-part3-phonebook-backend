require('dotenv').config()
const express =  require('express') //The aplication imports Node's built in web server module
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

//Application
app.use(express.static('build'))
app.use(express.json())
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


app.get('/', 
  (request, response, next)=>{
    console.log("get index");
    response.send('<div><h1>Part 3: Phonebook Backend</h1><p><br>Made by @jochaes</p></div>')
  }
)

app.get('/info', (request, response, next )=>{
  console.log("Get Info");
  const len = persons.length
  const info = `Phonebook has info for ${len} people`
  const date = new Date()
  const resStr = `<div><p>${info}</p><p>${date}</p></div>`

  response.send(resStr)
  
})

app.get('/api/persons', (request, response, next)=>{

  Person.find({}).then(
    notes=>{
      response.json(notes)
    }
  ).catch( error => next(error))
})

app.get('/api/persons/:id', (request, response, next )=>{


  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)  
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next)=>{

  Person.findByIdAndRemove( request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {

  const body  = request.body;
  if(!body.number || !body.name){
    const err =  new Error("content missing")
    err.name = "ContentMissing"
    return next(err)
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true} )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

} )

app.post('/api/persons', (request, response, next)=>{

  const body = request.body 

  if(!body.number || !body.name){
    const err =  new Error("content missing")
    err.name = "ContentMissing"
    return next(err)
  }

  const newPerson = new Person({
     name: body.name,
     number: body.number
  })

  //Save Person to the DB
  newPerson.save()
    .then(
      savedPerson => {
        response.json(savedPerson)
    })
    .catch( error => next(error))
})



//Middleware
const unknownEndpoint = (request, response) => {
  console.log("Unknown endpoint request");
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name = 'ContentMissing'){
    return response.status(400).send({error: 'content missing'}) 
  }

  if(error.name = 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
