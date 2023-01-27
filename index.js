const express =  require('express') //The aplication imports Node's built in web server module
const morgan = require('morgan')




const app = express()
app.use(express.json())
app.use(morgan('tiny'))

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


app.get('/', 
  (request, response)=>{
    console.log("get index");
    response.send('<h1>Phonebook Backend</h1>')
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
  console.log("Get all persons");
  response.send(persons)
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
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)

  response.statusMessage = `Person with id ${id} deleted from database`
  response.status(204).end()

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

  if( persons.find( person => person.name === body.name ) ){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }  

  const newPerson = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT,
  () => {
    console.log(`Server running on port ${PORT}`);
  }  
)
